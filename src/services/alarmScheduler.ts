import { alarmService } from './alarmService';

let checkInterval: NodeJS.Timeout | null = null;
let onAlarmTrigger: ((alarmId: string) => void) | null = null;

export const alarmScheduler = {
  start(userId: string, callback: (alarmId: string) => void) {
    onAlarmTrigger = callback;
    
    // Check every 30 seconds for alarms
    if (checkInterval) {
      clearInterval(checkInterval);
    }

    checkInterval = setInterval(() => {
      this.checkAlarms(userId);
    }, 30000); // Check every 30 seconds

    // Also check immediately
    this.checkAlarms(userId);
  },

  stop() {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    onAlarmTrigger = null;
  },

  async checkAlarms(userId: string) {
    try {
      const alarms = await alarmService.getAlarms(userId);
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      for (const alarm of alarms) {
        if (!alarm.is_active) continue;
        
        // Check if alarm should trigger today
        const shouldTriggerToday = alarm.days_of_week?.includes(currentDay);
        if (!shouldTriggerToday) continue;

        // Check if time matches (within 1 minute window)
        const alarmTime = alarm.time.substring(0, 5); // Get HH:MM
        if (alarmTime === currentTime && onAlarmTrigger) {
          // Check if we haven't triggered this alarm in the last 2 minutes
          const lastTriggered = localStorage.getItem(`alarm_triggered_${alarm.id}`);
          const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
          
          if (!lastTriggered || parseInt(lastTriggered) < twoMinutesAgo) {
            localStorage.setItem(`alarm_triggered_${alarm.id}`, String(Date.now()));
            onAlarmTrigger(alarm.id);
            
            // Vibrate if enabled
            if (alarm.vibration_enabled && 'vibrate' in navigator) {
              navigator.vibrate([500, 200, 500, 200, 500]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to check alarms:', error);
    }
  }
};
