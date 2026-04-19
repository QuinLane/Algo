let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playTone(value: number, maxValue: number, minFreq = 120, maxFreq = 1200): void {
  const ac = getCtx();
  const freq = minFreq + (value / maxValue) * (maxFreq - minFreq);
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  gain.gain.setValueAtTime(0.08, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.1);
}

export function playSuccessTone(): void {
  const ac = getCtx();
  const freqs = [400, 500, 630, 800];
  freqs.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const t = ac.currentTime + i * 0.07;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  });
}

export function playFailTone(): void {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(200, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(120, ac.currentTime + 0.35);
  gain.gain.setValueAtTime(0.06, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.35);
}

export function resumeCtx(): void {
  ctx?.resume();
}
