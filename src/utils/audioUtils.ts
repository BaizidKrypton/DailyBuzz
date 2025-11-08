let audioContext: AudioContext | null = null;
let currentSound: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

export const audioUtils = {
  async playAlarmSound(toneName: string = 'default') {
    try {
      // Initialize audio context if not exists
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Create gain node for volume control
      if (!gainNode) {
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.3; // Start at 30% volume
      }

      // For now, use a simple oscillator as alarm sound
      // In production, load actual audio file
      currentSound = audioContext.createOscillator();
      const volumeNode = audioContext.createGain();
      
      currentSound.connect(volumeNode);
      volumeNode.connect(gainNode);
      
      // Create alarm pattern
      currentSound.type = 'sine';
      currentSound.frequency.value = 800;
      
      volumeNode.gain.setValueAtTime(0, audioContext.currentTime);
      volumeNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);
      
      currentSound.start();
      
      // Increase volume gradually every 10 seconds
      let volumeLevel = 0.3;
      const volumeInterval = setInterval(() => {
        if (volumeLevel < 1) {
          volumeLevel = Math.min(volumeLevel + 0.1, 1);
          if (gainNode) {
            gainNode.gain.value = volumeLevel;
          }
        } else {
          clearInterval(volumeInterval);
        }
      }, 10000);

      return volumeInterval;
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  },

  stopAlarmSound(volumeInterval?: number) {
    if (volumeInterval) {
      clearInterval(volumeInterval);
    }
    
    if (currentSound) {
      currentSound.stop();
      currentSound.disconnect();
      currentSound = null;
    }
    
    if (gainNode) {
      gainNode.gain.value = 0.3; // Reset volume
    }
  },

  async requestAudioPermission() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      return true;
    } catch (error) {
      console.error('Failed to get audio permission:', error);
      return false;
    }
  }
};
