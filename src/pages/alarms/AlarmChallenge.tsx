import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alarmService } from '@/services/alarmService';
import { challengeService } from '@/services/challengeService';
import { alarmScheduler } from '@/services/alarmScheduler';
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
      alarmScheduler.stopSound();
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Bell className="h-20 w-20 text-primary animate-bounce" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {alarm.title}
          </CardTitle>
          <p className="text-muted-foreground">
            Solve this {challenge.type.toLowerCase()} challenge to dismiss the alarm
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPlaying && (
            <div className="flex items-center justify-center gap-3 text-primary bg-primary/10 rounded-lg py-3 px-4">
              <Volume2 className="h-6 w-6 animate-pulse" />
              <span className="text-base font-semibold">Alarm ringing...</span>
            </div>
          )}

          <div className="bg-gradient-to-br from-muted to-muted/50 p-8 rounded-xl text-center border-2 border-primary/10 shadow-inner">
            <p className="text-2xl font-bold">{challenge.question}</p>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
              className="text-center text-xl h-14 border-2"
            />

            <Button 
              onClick={handleSubmit} 
              className="w-full h-14 text-lg shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              Submit Answer
            </Button>
          </div>

          {attempts > 0 && (
            <p className="text-center text-sm text-muted-foreground bg-muted/50 py-2 px-4 rounded-lg">
              Attempts: <span className="font-semibold text-foreground">{attempts}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
