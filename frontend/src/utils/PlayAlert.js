let audioCtx = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  console.log("🔊 Audio enabled");
}

export function playBeep(type = "normal") {
  if (!audioCtx) {
    console.log("⛔ Audio not initialized");
    return;
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === "low") osc.frequency.value = 400;
  else if (type === "full") osc.frequency.value = 900;
  else osc.frequency.value = 700;

  gain.gain.setValueAtTime(1, audioCtx.currentTime);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.4
  );
}
