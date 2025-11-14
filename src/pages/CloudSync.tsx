import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud, Download, Upload, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CloudSync() {
  const { toast } = useToast();

  const handleBackup = () => {
    toast({
      title: 'Backup Initiated',
      description: 'Your data is being backed up to the cloud.'
    });
  };

  const handleRestore = () => {
    toast({
      title: 'Restore Initiated',
      description: 'Your data is being restored from the cloud.'
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cloud Sync
          </h1>
          <p className="text-muted-foreground mt-2">Backup and restore your data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="border-2 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-primary" />
                Backup Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Save your alarms, tasks, notes, and finance data to the cloud.
              </p>
              <Button onClick={handleBackup} className="w-full h-12 bg-gradient-to-r from-primary to-primary/80">
                <Cloud className="mr-2 h-5 w-5" />
                Backup Now
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-6 w-6 text-secondary" />
                Restore Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Restore your data from a previous cloud backup.
              </p>
              <Button onClick={handleRestore} className="w-full h-12 bg-gradient-to-r from-secondary to-secondary/80">
                <Download className="mr-2 h-5 w-5" />
                Restore Now
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 shadow-xl bg-gradient-to-br from-card to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-accent" />
              Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Last Backup</span>
                <span className="text-muted-foreground">Never</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Auto-Sync</span>
                <span className="text-accent font-semibold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Storage Used</span>
                <span className="text-muted-foreground">0 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
