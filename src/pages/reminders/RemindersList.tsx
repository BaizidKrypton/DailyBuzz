import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { reminderService } from '@/services/reminderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string;
  status: string;
  category: string | null;
  completed_at: string | null;
};

export default function RemindersList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const data = await reminderService.getTasks(user!.id);
      setTasks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await reminderService.completeTask(id);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'COMPLETED', completed_at: new Date().toISOString() } : t));
      toast({
        title: 'Success',
        description: 'Task completed'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete task',
        variant: 'destructive'
      });
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'destructive';
      case 'HIGH': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-8 w-8" />
            Tasks & Reminders
          </h1>
          <Button onClick={() => navigate('/reminders/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold">Pending Tasks</h2>
              {pendingTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No pending tasks
                  </CardContent>
                </Card>
              ) : (
                pendingTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => handleComplete(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1" onClick={() => navigate(`/reminders/edit/${task.id}`)}>
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            {task.category && (
                              <Badge variant="outline">{task.category}</Badge>
                            )}
                            {task.due_date && (
                              <Badge variant="outline">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>

            {completedTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-muted-foreground">Completed</h2>
                {completedTasks.map((task) => (
                  <Card key={task.id} className="opacity-60">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Checkbox checked={true} disabled className="mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-lg line-through">{task.title}</CardTitle>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-through">{task.description}</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
