import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlarmClock, Bell, FileText, MessageSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlarmClock className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">DailyBuzz</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Wake Up Smarter with DailyBuzz
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your comprehensive productivity companion with intelligent alarms, smart reminders, 
            quick notes, and AI assistance—all in one place.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Your Day Right
            </Button>
          </Link>
        </section>

        <section className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <AlarmClock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Complex Alarms</h3>
            <p className="text-muted-foreground">
              Solve puzzles to dismiss alarms and start your day fully alert
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Smart Reminders</h3>
            <p className="text-muted-foreground">
              Persistent notifications until tasks are complete
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Quick Notes</h3>
            <p className="text-muted-foreground">
              Capture thoughts instantly with voice-to-text support
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Buzz AI Assistant</h3>
            <p className="text-muted-foreground">
              Get smart suggestions and productivity insights
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 DailyBuzz. Your daily productivity companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
