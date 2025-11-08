import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Droplets, Pill } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  category: string | null;
  completed_at: string | null;
}

interface TaskCategoryTabsProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  getPriorityColor: (priority: string) => "default" | "secondary" | "destructive";
  children?: React.ReactNode;
}

export function TaskCategoryTabs({ 
  tasks, 
  onComplete, 
  onEdit, 
  getPriorityColor,
  children 
}: TaskCategoryTabsProps) {
  const dailyTasks = tasks.filter(t => t.category === 'daily_activity');
  const waterTasks = tasks.filter(t => t.category === 'water');
  const medicineTasks = tasks.filter(t => t.category === 'medicine');

  const renderTaskList = (categoryTasks: Task[]) => (
    <div className="space-y-3">
      {categoryTasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No tasks in this category</p>
      ) : (
        categoryTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => onEdit(task.id)}
          >
            <input
              type="checkbox"
              checked={task.status === 'COMPLETED'}
              onChange={(e) => {
                e.stopPropagation();
                onComplete(task.id);
              }}
              className="mt-1 h-5 w-5 rounded border-gray-300"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-semibold ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  task.priority === 'URGENT' ? 'bg-destructive/10 text-destructive' :
                  task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                  task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              {task.due_date && (
                <p className="text-xs text-muted-foreground mt-1">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="daily" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Daily Activity
        </TabsTrigger>
        <TabsTrigger value="water" className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          Water
        </TabsTrigger>
        <TabsTrigger value="medicine" className="flex items-center gap-2">
          <Pill className="h-4 w-4" />
          Medicine
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="daily" className="space-y-4">
        {renderTaskList(dailyTasks)}
      </TabsContent>
      
      <TabsContent value="water" className="space-y-4">
        {renderTaskList(waterTasks)}
      </TabsContent>
      
      <TabsContent value="medicine" className="space-y-4">
        {renderTaskList(medicineTasks)}
      </TabsContent>
    </Tabs>
  );
}
