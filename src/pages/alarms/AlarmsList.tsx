import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { alarmService } from '@/services/alarmService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Clock, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Alarm = {
  id: string;
  title: string;
  time: string;
  days_of_week: number[];
  challenge_type: string;
  is_active: boolean;
  difficulty: string;
};

export default function AlarmsList() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadAlarms();
    }
  }, [user]);

  const loadAlarms = async () => {
    try {
      const data = await alarmService.getAlarms(user!.id);
      setAlarms(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load alarms',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await alarmService.toggleAlarm(id, !isActive);
      setAlarms(alarms.map(a => a.id === id ? { ...a, is_active: !isActive } : a));
      toast({
        title: 'Success',
        description: `Alarm ${!isActive ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update alarm',
        variant: 'destructive'
      });
    }
  };

  const filteredAlarms = alarms.filter(alarm =>
    alarm.title.toLowerCase().includes(search.toLowerCase())
  );

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Alarms
          </h1>
          <Button onClick={() => navigate('/alarms/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Alarm
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alarms..."
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
        ) : filteredAlarms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No alarms found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAlarms.map((alarm) => (
              <Card key={alarm.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1" onClick={() => navigate(`/alarms/edit/${alarm.id}`)}>
                      <CardTitle className="text-4xl font-bold mb-2">
                        {alarm.time}
                      </CardTitle>
                      <p className="text-lg font-medium">{alarm.title}</p>
                      <div className="flex gap-1 mt-2">
                        {alarm.days_of_week.map((day) => (
                          <span key={day} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {dayNames[day]}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {alarm.challenge_type} • {alarm.difficulty}
                      </p>
                    </div>
                    <Switch
                      checked={alarm.is_active}
                      onCheckedChange={() => handleToggle(alarm.id, alarm.is_active)}
                    />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
