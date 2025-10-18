import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alarmService } from '@/services/alarmService';
import { challengeService } from '@/services/challengeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bell, Volume2 } from 'lucide-react';

export default function AlarmChallenge() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [alarm, setAlarm] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    loadAlarmAndChallenge();
  }, [id]);

  const loadAlarmAndChallenge = async () => {
    try {
      const alarmData = await alarmService.getAlarmById(id!);
      setAlarm(alarmData);
      
      const newChallenge = challengeService.generateChallenge(
        alarmData.challenge_type,
        alarmData.difficulty
      );
      setChallenge(newChallenge);
    } catch (error) {
      console.error('Failed to load alarm:', error);
      navigate('/dashboard');
    }
  };

  const handleSubmit = () => {
    if (!challenge || !userAnswer.trim()) return;

    const isCorrect = challengeService.validateAnswer(
      challenge,
      userAnswer.trim()
    );

    if (isCorrect) {
      setIsPlaying(false);
      toast({
        title: 'Correct!',
        description: 'Alarm dismissed',
      });
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setAttempts(prev => prev + 1);
      setUserAnswer('');
      toast({
        title: 'Incorrect',
        description: 'Try again!',
        variant: 'destructive'
      });
    }
  };

  if (!alarm || !challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bell className="h-16 w-16 text-primary animate-bounce" />
          </div>
          <CardTitle className="text-2xl">{alarm.title}</CardTitle>
          <p className="text-muted-foreground mt-2">
            Solve this {challenge.type.toLowerCase()} challenge to dismiss the alarm
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPlaying && (
            <div className="flex items-center justify-center gap-2 text-primary">
              <Volume2 className="h-5 w-5 animate-pulse" />
              <span className="text-sm">Alarm ringing...</span>
            </div>
          )}

          <div className="bg-muted p-6 rounded-lg text-center">
            <p className="text-lg font-semibold">{challenge.question}</p>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
              className="text-center text-lg"
            />

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              size="lg"
            >
              Submit Answer
            </Button>
          </div>

          {attempts > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Attempts: {attempts}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
