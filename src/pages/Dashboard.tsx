import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { alarmService } from '@/services/alarmService';
import { reminderService } from '@/services/reminderService';
import { notesService } from '@/services/notesService';
import { Clock, CheckCircle2, StickyNote, Plus, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Welcome back, {user?.email?.split('@')[0]}! 👋</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-primary/20 bg-gradient-to-br from-card to-primary/5" onClick={() => navigate('/alarms')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.alarms}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Click to manage
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-secondary/20 bg-gradient-to-br from-card to-secondary/5" onClick={() => navigate('/reminders')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary">{stats.tasks}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Click to view
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-accent/20 bg-gradient-to-br from-card to-accent/5" onClick={() => navigate('/notes')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <StickyNote className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{stats.notes}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Click to browse
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/alarms/create')} 
                className="h-28 flex flex-col gap-3 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
                size="lg"
              >
                <Clock className="h-8 w-8" />
                <span className="text-base font-semibold">Add Alarm</span>
              </Button>
              <Button 
                onClick={() => navigate('/reminders/create')} 
                className="h-28 flex flex-col gap-3 bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-md"
                size="lg"
              >
                <CheckCircle2 className="h-8 w-8" />
                <span className="text-base font-semibold">Add Task</span>
              </Button>
              <Button 
                onClick={() => navigate('/notes/create')} 
                className="h-28 flex flex-col gap-3 bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-md"
                size="lg"
              >
                <StickyNote className="h-8 w-8" />
                <span className="text-base font-semibold">New Note</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
