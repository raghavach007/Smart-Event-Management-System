import { useCallback } from 'react';

export const useRetroSound = (enabled) => {
  const playTone = useCallback((freq, type, duration) => {
    if (!enabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [enabled]);

  const playClick = () => playTone(800, 'square', 0.05);
  const playSuccess = () => { playTone(600, 'sine', 0.1); setTimeout(() => playTone(1200, 'square', 0.2), 100); };
  const playError = () => playTone(150, 'sawtooth', 0.3);
  const playHover = () => playTone(200, 'sine', 0.02);

  return { playClick, playSuccess, playError, playHover };
};