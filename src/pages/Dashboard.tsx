import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { alarmService } from '@/services/alarmService';
import { reminderService } from '@/services/reminderService';
import { notesService } from '@/services/notesService';
import { Clock, CheckCircle2, StickyNote, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    alarms: 0,
    tasks: 0,
    notes: 0
  });

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const [alarms, tasks, notes] = await Promise.all([
        alarmService.getAlarms(user!.id),
        reminderService.getTasks(user!.id),
        notesService.getNotes(user!.id)
      ]);
      
      setStats({
        alarms: alarms.filter(a => a.is_active).length,
        tasks: tasks.filter(t => t.status === 'PENDING').length,
        notes: notes.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email?.split('@')[0]}!</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/alarms')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.alarms}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to manage alarms
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/reminders')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.tasks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view tasks
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/notes')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <StickyNote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.notes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to browse notes
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => navigate('/alarms/create')} className="h-24 flex flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span>Add Alarm</span>
              </Button>
              <Button onClick={() => navigate('/reminders/create')} className="h-24 flex flex-col gap-2">
                <CheckCircle2 className="h-6 w-6" />
                <span>Add Task</span>
              </Button>
              <Button onClick={() => navigate('/notes/create')} className="h-24 flex flex-col gap-2">
                <StickyNote className="h-6 w-6" />
                <span>New Note</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
