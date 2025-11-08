import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { alarmService } from '@/services/alarmService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function CreateAlarm() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('07:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);
  const [challengeType, setChallengeType] = useState<'MATH' | 'LOGIC' | 'TRIVIA' | 'MEMORY'>('MATH');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [alarmTone, setAlarmTone] = useState('default');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day: number) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an alarm title',
        variant: 'destructive'
      });
      return;
    }

    if (daysOfWeek.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one day',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await alarmService.createAlarm({
        user_id: user!.id,
        title,
        time,
        days_of_week: daysOfWeek,
        challenge_type: challengeType,
        difficulty,
        alarm_tone: alarmTone,
        vibration_enabled: vibrationEnabled,
        is_active: true
      });

      toast({
        title: 'Success',
        description: 'Alarm created successfully'
      });
      navigate('/alarms');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create alarm',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/alarms')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Alarm</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Alarm Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Wake up"
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

              <div>
                <Label>Alarm Tone</Label>
                <Select value={alarmTone} onValueChange={setAlarmTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Alarm</SelectItem>
                    <SelectItem value="gentle">Gentle Wake</SelectItem>
                    <SelectItem value="urgent">Urgent Alert</SelectItem>
                    <SelectItem value="melody">Morning Melody</SelectItem>
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
                  {loading ? 'Creating...' : 'Create Alarm'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/alarms')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
