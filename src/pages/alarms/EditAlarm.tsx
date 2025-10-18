import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { alarmService } from '@/services/alarmService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditAlarm() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('07:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [challengeType, setChallengeType] = useState<'MATH' | 'LOGIC' | 'TRIVIA' | 'MEMORY'>('MATH');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    if (id && user) {
      loadAlarm();
    }
  }, [id, user]);

  const loadAlarm = async () => {
    try {
      const alarm = await alarmService.getAlarmById(id!);
      setTitle(alarm.title);
      setTime(alarm.time);
      setDaysOfWeek(alarm.days_of_week || []);
      setChallengeType(alarm.challenge_type as any);
      setDifficulty(alarm.difficulty as any);
      setVibrationEnabled(alarm.vibration_enabled ?? true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load alarm',
        variant: 'destructive'
      });
      navigate('/alarms');
    } finally {
      setInitialLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await alarmService.updateAlarm(id!, {
        title,
        time,
        days_of_week: daysOfWeek,
        challenge_type: challengeType,
        difficulty,
        vibration_enabled: vibrationEnabled
      });

      toast({
        title: 'Success',
        description: 'Alarm updated successfully'
      });
      navigate('/alarms');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update alarm',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await alarmService.deleteAlarm(id!);
      toast({
        title: 'Success',
        description: 'Alarm deleted successfully'
      });
      navigate('/alarms');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete alarm',
        variant: 'destructive'
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/alarms')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Alarm</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Alarm Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div>
                <Label>Days of Week</Label>
                <div className="flex gap-2 mt-2">
                  {dayNames.map((day, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={daysOfWeek.includes(index) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleDay(index)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Challenge Type</Label>
                <Select value={challengeType} onValueChange={(v: any) => setChallengeType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MATH">Math Problem</SelectItem>
                    <SelectItem value="LOGIC">Logic Puzzle</SelectItem>
                    <SelectItem value="TRIVIA">Trivia Question</SelectItem>
                    <SelectItem value="MEMORY">Memory Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="vibration">Vibration</Label>
                <Switch
                  id="vibration"
                  checked={vibrationEnabled}
                  onCheckedChange={setVibrationEnabled}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Updating...' : 'Update Alarm'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Alarm</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this alarm? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
