import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { alarmService } from '@/services/alarmService';
import { reminderService } from '@/services/reminderService';
import { notesService } from '@/services/notesService';
import { financeService } from '@/services/financeService';
import { Clock, CheckCircle2, StickyNote, Wallet, TrendingUp, Award } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    alarms: { total: 0, active: 0 },
    tasks: { total: 0, completed: 0, pending: 0 },
    notes: { total: 0 },
    finance: { income: 0, expenses: 0, balance: 0 }
  });

  useEffect(() => {
    if (user) {
      loadAllStats();
    }
  }, [user]);

  const loadAllStats = async () => {
    try {
      const [alarms, tasks, notes, financeStats] = await Promise.all([
        alarmService.getAlarms(user!.id),
        reminderService.getTasks(user!.id),
        notesService.getNotes(user!.id),
        financeService.getMonthlyStats(user!.id)
      ]);

      setStats({
        alarms: {
          total: alarms.length,
          active: alarms.filter(a => a.is_active).length
        },
        tasks: {
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'COMPLETED').length,
          pending: tasks.filter(t => t.status === 'PENDING').length
        },
        notes: {
          total: notes.length
        },
        finance: financeStats
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-2">Track your productivity and progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.alarms.active}</div>
              <p className="text-xs text-muted-foreground mt-1">of {stats.alarms.total} total</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-card to-secondary/5 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.tasks.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.tasks.pending} pending</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Notes</CardTitle>
              <StickyNote className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.notes.total}</div>
              <p className="text-xs text-muted-foreground mt-1">total notes</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <Wallet className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stats.finance.balance >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                ৳{stats.finance.balance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14">
            <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
            <TabsTrigger value="tasks" className="text-base">Tasks</TabsTrigger>
            <TabsTrigger value="finance" className="text-base">Finance</TabsTrigger>
            <TabsTrigger value="achievements" className="text-base">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Task Completion Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary/80 transition-all"
                      style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 border-2 rounded-xl bg-gradient-to-br from-card to-primary/5">
                    <TrendingUp className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">Productivity Score</h3>
                    <p className="text-2xl font-bold text-primary mt-2">
                      {Math.round((stats.tasks.completed / (stats.tasks.total || 1)) * 100)}%
                    </p>
                  </div>
                  <div className="p-4 border-2 rounded-xl bg-gradient-to-br from-card to-accent/5">
                    <Award className="h-8 w-8 text-accent mb-2" />
                    <h3 className="font-semibold">Current Streak</h3>
                    <p className="text-2xl font-bold text-accent mt-2">0 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Task Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border-2 rounded-xl bg-gradient-to-br from-card to-primary/5">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-3xl font-bold text-primary mt-2">{stats.tasks.total}</p>
                    </div>
                    <div className="text-center p-4 border-2 rounded-xl bg-gradient-to-br from-card to-secondary/5">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold text-secondary mt-2">{stats.tasks.completed}</p>
                    </div>
                    <div className="text-center p-4 border-2 rounded-xl bg-gradient-to-br from-card to-accent/5">
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold text-accent mt-2">{stats.tasks.pending}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border-2 rounded-xl bg-gradient-to-br from-card to-secondary/5">
                    <p className="text-sm text-muted-foreground">Income</p>
                    <p className="text-3xl font-bold text-secondary mt-2">৳{stats.finance.income.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-6 border-2 rounded-xl bg-gradient-to-br from-card to-destructive/5">
                    <p className="text-sm text-muted-foreground">Expenses</p>
                    <p className="text-3xl font-bold text-destructive mt-2">৳{stats.finance.expenses.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-6 border-2 rounded-xl bg-gradient-to-br from-card to-accent/5">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className={`text-3xl font-bold mt-2 ${stats.finance.balance >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                      ৳{stats.finance.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Achievements & Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet. Keep working to unlock badges!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
