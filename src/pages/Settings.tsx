import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface UserPreferences {
  notification_push: boolean;
  notification_email: boolean;
  notification_sound: boolean;
  vibration_enabled: boolean;
  dnd_enabled: boolean;
  dnd_start_time: string | null;
  dnd_end_time: string | null;
}

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    notification_push: true,
    notification_email: true,
    notification_sound: true,
    vibration_enabled: true,
    dnd_enabled: false,
    dnd_start_time: null,
    dnd_end_time: null,
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setPreferences({
          notification_push: data.notification_push,
          notification_email: data.notification_email,
          notification_sound: data.notification_sound,
          vibration_enabled: data.vibration_enabled,
          dnd_enabled: data.dnd_enabled,
          dnd_start_time: data.dnd_start_time,
          dnd_end_time: data.dnd_end_time,
        });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your app preferences</p>
          </div>
          <Button onClick={() => navigate('/profile')} variant="outline">
            View Profile
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how DailyBuzz looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-push">Push Notifications</Label>
              <Switch
                id="notification-push"
                checked={preferences.notification_push}
                onCheckedChange={(checked) => updatePreference('notification_push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-email">Email Notifications</Label>
              <Switch
                id="notification-email"
                checked={preferences.notification_email}
                onCheckedChange={(checked) => updatePreference('notification_email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-sound">Notification Sounds</Label>
              <Switch
                id="notification-sound"
                checked={preferences.notification_sound}
                onCheckedChange={(checked) => updatePreference('notification_sound', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="vibration">Vibration</Label>
              <Switch
                id="vibration"
                checked={preferences.vibration_enabled}
                onCheckedChange={(checked) => updatePreference('vibration_enabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Do Not Disturb</CardTitle>
            <CardDescription>Set quiet hours for notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dnd-enabled">Enable Do Not Disturb</Label>
              <Switch
                id="dnd-enabled"
                checked={preferences.dnd_enabled}
                onCheckedChange={(checked) => updatePreference('dnd_enabled', checked)}
              />
            </div>
            {preferences.dnd_enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dnd-start">Start Time</Label>
                  <input
                    id="dnd-start"
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={preferences.dnd_start_time || '22:00'}
                    onChange={(e) => updatePreference('dnd_start_time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dnd-end">End Time</Label>
                  <input
                    id="dnd-end"
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={preferences.dnd_end_time || '08:00'}
                    onChange={(e) => updatePreference('dnd_end_time', e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button onClick={savePreferences} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
