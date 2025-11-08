import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { reminderService } from '@/services/reminderService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, CheckCircle2 } from 'lucide-react';
import { TaskCategoryTabs } from '@/components/TaskCategoryTabs';

type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  category: string | null;
  completed_at: string | null;
};

export default function RemindersList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'COMPLETED' as const, completed_at: new Date().toISOString() } : t));
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
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED');

  const getPriorityColor = (priority: string): "default" | "secondary" | "destructive" => {
    switch (priority) {
      case 'URGENT': return 'destructive';
      case 'HIGH': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-muted-foreground mt-2">Manage your daily tasks, water intake, and medications</p>
          </div>
          <Button onClick={() => navigate('/reminders/create')} size="lg" className="shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Task
          </Button>
        </div>

        <Card className="mb-6 border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Card className="mb-8 border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle2 className="h-6 w-6 text-secondary" />
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskCategoryTabs
                  tasks={pendingTasks}
                  onComplete={handleComplete}
                  onEdit={(id) => navigate(`/reminders/edit/${id}`)}
                  getPriorityColor={getPriorityColor}
                />
              </CardContent>
            </Card>

            {completedTasks.length > 0 && (
              <Card className="border-2 shadow-lg opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5" />
                    Completed Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30"
                      >
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                        <div className="flex-1">
                          <p className="font-semibold line-through text-muted-foreground">{task.title}</p>
                          {task.completed_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed: {new Date(task.completed_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
