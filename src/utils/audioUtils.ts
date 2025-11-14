let currentAudio: HTMLAudioElement | null = null;
let volumeInterval: number | null = null;

const ALARM_TONES: { [key: string]: string } = {
  'default': '/sounds/alarm-default.mp3',
  'classic': '/sounds/alarm-classic.mp3',
  'gentle': '/sounds/alarm-gentle.mp3'
};

export const audioUtils = {
  async playAlarmSound(toneName: string = 'default') {
    try {
      // Stop any existing sound
      this.stopAlarmSound();

      // Get the alarm tone path
      const tonePath = ALARM_TONES[toneName] || ALARM_TONES['default'];
      
      // Create and configure audio element
      currentAudio = new Audio(tonePath);
      currentAudio.loop = true;
      currentAudio.volume = 0.3; // Start at 30% volume

      // Play the audio
      await currentAudio.play();

      // Increase volume gradually every 10 seconds
      let volumeLevel = 0.3;
      volumeInterval = window.setInterval(() => {
        if (volumeLevel < 1 && currentAudio) {
          volumeLevel = Math.min(volumeLevel + 0.1, 1);
          currentAudio.volume = volumeLevel;
        } else if (volumeInterval) {
          clearInterval(volumeInterval);
        }
      }, 10000);

      return volumeInterval;
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
      return null;
    }
  },

  stopAlarmSound() {
    if (volumeInterval) {
      clearInterval(volumeInterval);
      volumeInterval = null;
    }
    
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  },

  async requestAudioPermission() {
    try {
      // Test audio playback
      const testAudio = new Audio();
      testAudio.volume = 0;
      await testAudio.play();
      testAudio.pause();
      return true;
    } catch (error) {
      console.error('Failed to get audio permission:', error);
      return false;
    }
  }
};
