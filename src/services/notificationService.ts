export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  async sendNotification(title: string, options?: NotificationOptions) {
    const hasPermission = await this.requestPermission();
    
    if (hasPermission) {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  },

  async scheduleTaskReminder(taskId: string, taskTitle: string) {
    // Send initial notification
    await this.sendNotification('Task Reminder', {
      body: taskTitle,
      tag: taskId,
      requireInteraction: true
    });

    // Schedule repeat notifications every 5 minutes
    const intervalId = setInterval(async () => {
      await this.sendNotification('Task Reminder (Pending)', {
        body: `${taskTitle} - Still pending`,
        tag: taskId,
        requireInteraction: true
      });
    }, 5 * 60 * 1000); // 5 minutes

    // Store interval ID for later cleanup
    localStorage.setItem(`notification_interval_${taskId}`, String(intervalId));
    
    return intervalId;
  },

  stopTaskReminder(taskId: string) {
    const intervalId = localStorage.getItem(`notification_interval_${taskId}`);
    if (intervalId) {
      clearInterval(Number(intervalId));
      localStorage.removeItem(`notification_interval_${taskId}`);
    }
  }
};
