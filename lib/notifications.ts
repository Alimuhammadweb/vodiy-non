// Notification and audio alert utilities

export function playAudioAlert(times: number = 3) {
  // Create a simple beep sound using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  for (let i = 0; i < times; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Hz
    oscillator.type = 'sine';

    const startTime = audioContext.currentTime + i * 0.3;
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.1);
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return Promise.resolve();
    } else if (Notification.permission !== 'denied') {
      return Notification.requestPermission();
    }
  }
  return Promise.resolve();
}

export function showBrowserNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, options);
  }
}

export function checkOrderTime(createdAt: Date, targetMinutes: number = 30): boolean {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - new Date(createdAt).getTime()) / (1000 * 60));
  return diffMinutes >= targetMinutes;
}
