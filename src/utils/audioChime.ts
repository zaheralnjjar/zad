/**
 * Synthesizes a gentle, serene 3-tone chime for Islamic prayer reminders
 * using standard Web Audio API without requiring external audio files.
 */
export function playSereneChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic frequencies for a peaceful, warm bell chime (D major / Pentatonic warmth)
    const notes = [
      { freq: 587.33, time: 0.0, duration: 1.2 }, // D5
      { freq: 739.99, time: 0.25, duration: 1.4 }, // F#5
      { freq: 880.00, time: 0.5, duration: 1.8 }, // A5
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      // Smooth attack and natural exponential decay
      gain.gain.setValueAtTime(0.001, now + note.time);
      gain.gain.linearRampToValueAtTime(0.2, now + note.time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.duration);
    });

    // Close audio context after chime finishes
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 2500);
  } catch (e) {
    console.warn('Audio chime playback error:', e);
  }
}
