// Kyrie Typo - 纯 Web Audio API 合成音效（零外部依赖、毫秒级响应）

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  resume() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      return this.ctx.resume();
    }
    return Promise.resolve();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // 1. 正确敲击按键：木琴/水滴 Q 弹清脆音（连击越高音调越晶莹灵动）
  playKeyPop(pitchIndex = 0, combo = 0) {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C大调音阶
    let freq = notes[pitchIndex % notes.length];

    // 随连击攀升音高与晶莹剔透感
    let extraSparkle = false;
    if (combo >= 10) {
      freq *= 1.5; // 超神状态：高纯净五度（明媚若天籁）
      extraSparkle = true;
    } else if (combo >= 5) {
      freq *= 1.25; // 极速状态：高大三度（轻快明快）
    } else if (combo >= 3) {
      freq *= 1.12; // 进阶状态：微升全音
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.45, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.26, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);

    // 超神状态叠加高频泛音水晶音
    if (extraSparkle) {
      const spOsc = this.ctx.createOscillator();
      const spGain = this.ctx.createGain();
      spOsc.type = 'sine';
      spOsc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);
      spGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      spGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      spOsc.connect(spGain);
      spGain.connect(this.ctx.destination);
      spOsc.start();
      spOsc.stop(this.ctx.currentTime + 0.09);
    }
  }

  // 2. 按错按键：温柔的泡泡弹簧音（非刺耳警报）
  playKeyWrong() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  // 2.1 字母爆炸与星光喷射专属音效（清脆 Q 弹爆破 + 晶莹魔法星光）
  playWordExplosion() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. 清脆 Q 弹的“啵/砰！”破裂打击音
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(720, t);
    popOsc.frequency.exponentialRampToValueAtTime(80, t + 0.09);
    popGain.gain.setValueAtTime(0.35, t);
    popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(t);
    popOsc.stop(t + 0.12);

    // 2. 模拟爆破微气压扩散（轻柔短噪波，增添弹性打击感）
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1600, t);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.07);
    } catch (e) {}

    // 3. 晶莹可爱的魔法星光小琶音 (Sparkle Chimes)
    const sparkles = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
    sparkles.forEach((freq, idx) => {
      const st = t + 0.025 + idx * 0.032;
      const sOsc = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      sOsc.type = 'sine';
      sOsc.frequency.setValueAtTime(freq, st);
      sGain.gain.setValueAtTime(0.14, st);
      sGain.gain.exponentialRampToValueAtTime(0.001, st + 0.18);
      sOsc.connect(sGain);
      sGain.connect(this.ctx.destination);
      sOsc.start(st);
      sOsc.stop(st + 0.19);
    });
  }

  // 3. 单词敲击完成：胜利华丽和弦（随连击数呈现鲜明的音调五级递进！）
  playWordSuccess(combo = 0) {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    let chord = [];
    let noteStep = 0.045;
    let sparkleChimes = [];

    if (combo >= 12) {
      // 👑 Tier 4: 超神狂热 (Double-Octave Master Fanfare: C6 - E6 - G6 - C7 + Shimmer)
      chord = [1046.50, 1318.51, 1567.98, 2093.00];
      sparkleChimes = [2093.00, 2637.02, 3135.96, 4186.01];
      noteStep = 0.038;
    } else if (combo >= 8) {
      // 🚀 Tier 3: 势不可挡 (G-Major Pentatonic Cascade: G5 - B5 - D6 - G6 - B6)
      chord = [783.99, 987.77, 1174.66, 1567.98, 1975.53];
      sparkleChimes = [1567.98, 1975.53, 2349.32];
      noteStep = 0.04;
    } else if (combo >= 5) {
      // ⚡ Tier 2: 极速疾风 (E-Major Bright Arpeggio: E5 - G#5 - B5 - E6)
      chord = [659.25, 830.61, 987.77, 1318.51];
      sparkleChimes = [1318.51, 1661.22];
      noteStep = 0.045;
    } else if (combo >= 3) {
      // 🔥 Tier 1: 渐入佳境 (D-Major Ascending Chime: D5 - F#5 - A5 - D6)
      chord = [587.33, 739.99, 880.00, 1174.66];
      noteStep = 0.05;
    } else {
      // Tier 0: 经典 C 大调基础三和弦 (C5 - E5 - G5 - C6)
      chord = [523.25, 659.25, 783.99, 1046.50];
      noteStep = 0.052;
    }

    // 演奏主体递进和弦
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const noteTime = t + idx * noteStep;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.24, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.40);
    });

    // 高连击专属华丽星光琶音
    if (sparkleChimes.length > 0) {
      sparkleChimes.forEach((freq, idx) => {
        const spOsc = this.ctx.createOscillator();
        const spGain = this.ctx.createGain();
        spOsc.type = 'sine';
        const spTime = t + (chord.length * noteStep) + idx * 0.04;
        spOsc.frequency.setValueAtTime(freq, spTime);
        spGain.gain.setValueAtTime(0.14, spTime);
        spGain.gain.exponentialRampToValueAtTime(0.001, spTime + 0.28);
        spOsc.connect(spGain);
        spGain.connect(this.ctx.destination);
        spOsc.start(spTime);
        spOsc.stop(spTime + 0.30);
      });
    }
  }

  // 4. 里程碑连击加持华丽音阶（随 combo 阶梯递进音高与色彩）
  playComboSound(comboCount) {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const baseFreq = 520 + Math.min(comboCount * 65, 900);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.68, t + 0.14);

    gain.gain.setValueAtTime(0.24, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  // 5. 极速挑战紧迫倒计时音效：三阶加速节拍钟声（随着时间减少自动递增紧迫感与节奏）
  playTenseTick(urgencyLevel = 1, isTick = true) {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // ① 瞬态机械卡扣瞬态（带出极速打字街机的清晰打击感）
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    const clickFreq = urgencyLevel === 3 ? 1800 : (isTick ? 1400 : 1150);
    clickOsc.frequency.setValueAtTime(clickFreq, t);
    clickOsc.frequency.exponentialRampToValueAtTime(320, t + 0.016);

    clickGain.gain.setValueAtTime(0.18, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.02);

    // ② 纯净音调钟声 (Pitched Tension Clock / Game Pip)
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'sine';

    let freq, gainVal, dur;
    if (urgencyLevel === 3) {
      // 极度紧迫 (<0.8s): 激昂清脆的高频冲刺音
      freq = isTick ? 1046.50 : 880.00; // C6 / A5
      gainVal = 0.22;
      dur = 0.038;
    } else if (urgencyLevel === 2) {
      // 步步紧逼 (0.8s~1.5s): 加速急促的发条滴答
      freq = isTick ? 880.00 : 739.99; // A5 / F#5
      gainVal = 0.18;
      dur = 0.045;
    } else {
      // 稳步紧迫 (1.5s~2.4s): 经典悬念倒计时 Tick-Tock
      freq = isTick ? 739.99 : 587.33; // F#5 / D5
      gainVal = 0.15;
      dur = 0.052;
    }

    bodyOsc.frequency.setValueAtTime(freq, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(freq * 0.78, t + dur);

    bodyGain.gain.setValueAtTime(gainVal, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.ctx.destination);
    bodyOsc.start(t);
    bodyOsc.stop(t + dur + 0.005);
  }

  // 兼容别名
  playUrgentTick(isCritical = false) {
    this.playTenseTick(isCritical ? 3 : 1, true);
  }

  playHeartbeat() {
    this.playTenseTick(1, true);
  }

  // 扣心/超时音效：温和萌趣的水滴微降音（轻柔可亲，零挫败感）
  playHeartLost() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // 两个轻柔微小的水滴音 (G4 -> E4)
    [392.0, 329.63].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const noteTime = t + idx * 0.11;
      osc.frequency.setValueAtTime(freq, noteTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.88, noteTime + 0.12);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.15, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.13);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.14);
    });
  }

  // 6. 苹果键盘教程通关 / 徽章获得礼炮音
  playFanfare() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const notes = [392.0, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.42);
    });
  }

  // 7. 机械键盘极速盲打噼里啪啦音效 (Rapid Keyboard Clatter)
  playKeyboardClatter(startTime = 0, count = 9) {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const baseT = startTime || this.ctx.currentTime;
    for (let i = 0; i < count; i++) {
      const clickTime = baseT + i * 0.04 + (Math.random() * 0.008);
      
      // 高频机械轴微型咔哒瞬态
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      const f = 1900 + Math.random() * 1100;
      clickOsc.frequency.setValueAtTime(f, clickTime);
      clickOsc.frequency.exponentialRampToValueAtTime(320, clickTime + 0.016);

      clickGain.gain.setValueAtTime(0.32, clickTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.018);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(clickTime);
      clickOsc.stop(clickTime + 0.02);
    }
  }

  // 8. 欢快俏皮的卡通儿童笑声 (Hee-Hee-Hee Giggle)
  playCartoonGiggle(startTime = 0) {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const baseT = startTime || this.ctx.currentTime;
    // 5 声调皮连环欢笑声 "hee - hee - hee - ha - ha!"
    const pitches = [720, 840, 920, 780, 980];
    pitches.forEach((freq, idx) => {
      const gTime = baseT + idx * 0.085;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // 人声共振峰抖动微调
      osc.frequency.setValueAtTime(freq, gTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.18, gTime + 0.035);
      osc.frequency.linearRampToValueAtTime(freq * 0.95, gTime + 0.07);

      gain.gain.setValueAtTime(0.001, gTime);
      gain.gain.linearRampToValueAtTime(0.28, gTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, gTime + 0.075);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(gTime);
      osc.stop(gTime + 0.08);
    });
  }

  // 9. 纯净开场音效：温润灵动的亮丽和弦（清新悦耳、纯净舒适、不突兀、不嘈杂）
  playSimpleIntro() {
    if (this.muted) return;
    this.resume().then(() => {
      if (!this.ctx) return;

      // 清脆明朗的 C5-E5-G5-C6 上升和弦
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const t = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 采用 triangle 波形带来丰满温暖的类似木琴/钟琴泛音，清晰明朗
        osc.type = 'triangle';
        const noteTime = t + idx * 0.085;
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.35, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.42);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.44);
      });
    }).catch(() => {});
  }

  // 10. Mimimi 工作室完整片头（备用）
  playMimimiIntro() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // ① 开篇：键盘噼里啪啦狂敲声（打出 Kyrie's Typo 11个字符）
    this.playKeyboardClatter(t, 11);


    // ② 字母冲天起飞滑音 (Whistle: t + 0.18 -> t + 0.42)
    const whistleOsc = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistleOsc.type = 'sine';
    whistleOsc.frequency.setValueAtTime(260, t + 0.18);
    whistleOsc.frequency.exponentialRampToValueAtTime(860, t + 0.42);
    whistleGain.gain.setValueAtTime(0.001, t + 0.18);
    whistleGain.gain.linearRampToValueAtTime(0.25, t + 0.24);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.43);
    whistleOsc.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);
    whistleOsc.start(t + 0.18);
    whistleOsc.stop(t + 0.44);

    // ③ 重磅落地砸地 Q 弹大 Boing!! (t + 0.42)
    const boingOsc = this.ctx.createOscillator();
    const boingGain = this.ctx.createGain();
    boingOsc.type = 'triangle';
    boingOsc.frequency.setValueAtTime(180, t + 0.42);
    boingOsc.frequency.exponentialRampToValueAtTime(50, t + 0.85);
    boingGain.gain.setValueAtTime(0.48, t + 0.42);
    boingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.88);
    boingOsc.connect(boingGain);
    boingGain.connect(this.ctx.destination);
    boingOsc.start(t + 0.42);
    boingOsc.stop(t + 0.89);

    // ④ 闪耀星光和弦乐 (t + 0.46)
    const sparkles = [587.33, 739.99, 880.00, 1174.66, 1318.51];
    sparkles.forEach((freq, i) => {
      const spOsc = this.ctx.createOscillator();
      const spGain = this.ctx.createGain();
      spOsc.type = 'sine';
      spOsc.frequency.setValueAtTime(freq, t + 0.46 + i * 0.05);
      spGain.gain.setValueAtTime(0.18, t + 0.46 + i * 0.05);
      spGain.gain.exponentialRampToValueAtTime(0.001, t + 0.46 + i * 0.05 + 0.35);
      spOsc.connect(spGain);
      spGain.connect(this.ctx.destination);
      spOsc.start(t + 0.46 + i * 0.05);
      spOsc.stop(t + 0.46 + i * 0.05 + 0.38);
    });

    // ⑤ 欢快的儿童卡通欢笑声 (t + 0.52 响起)
    this.playCartoonGiggle(t + 0.52);
  }

  // 10. 标签页切换清脆水滴/微动开关音效 (Tab Switch Sound)
  playTabSwitch() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(460, t);
    osc1.frequency.exponentialRampToValueAtTime(740, t + 0.05);
    gain1.gain.setValueAtTime(0.22, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.08);
  }

  // 11. 极速挑战 3, 2, 1 倒计时与 GO 音效
  playCountdownPip(step) {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    if (step === 'GO') {
      // 激情起跑和弦
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C大调高能量和弦
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.03);
        gain.gain.setValueAtTime(0.2, t + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.03 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.03);
        osc.stop(t + idx * 0.03 + 0.38);
      });
    } else {
      // 3, 2, 1 逐级爬升的高音晶莹提示音
      const pitchMap = { 3: 523.25, 2: 659.25, 1: 783.99 };
      const freq = pitchMap[step] || 659.25;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.08);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    }
  }

  // 立即停止所有语音与背景音频
  stopAllSounds() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

window.soundFX = new SoundFX();



