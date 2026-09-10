// Kyrie Typo - 语音合成发音系统（支持中英文双语原声朗读）

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.enabled = true;
    this.sessionId = 0;
    this.currentUtterance = null;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  cancel() {
    this.sessionId++;
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  toggleSpeech() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.cancel();
    }
    return this.enabled;
  }

  // 朗读英文单词（支持完成回调与语速调节）
  speakEnglish(text, onComplete, rate = 1.15) {
    // 兼容历史调用 speakEnglish(text, rateNumber)
    if (typeof onComplete === 'number') {
      rate = onComplete;
      onComplete = null;
    }

    if (!this.enabled || !this.synth) {
      if (typeof onComplete === 'function') {
        setTimeout(onComplete, 80);
      }
      return;
    }

    this.cancel();
    const currentSession = this.sessionId;
    let finished = false;
    let fallbackTimer = null;

    const done = () => {
      if (currentSession !== this.sessionId) return;
      if (!finished) {
        finished = true;
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    };

    // 兜底超时：英文单词快速朗读通常 0.3~0.7s，最长设定 1.4s 防浏览器 TTS 偶发挂起
    fallbackTimer = setTimeout(done, 1400);

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate; // 极速挑战下更加明快利落
    utter.pitch = 1.1; // 活泼明亮的语调

    // 优先选择美音或英音儿童/女性友好声音
    const enVoice = this.voices.find(v => (v.lang.includes('en-US') || v.lang.includes('en-GB')) && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Jenny'))) || this.voices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
      utter.voice = enVoice;
    }

    utter.onend = () => done();
    utter.onerror = () => done();

    this.currentUtterance = utter;
    this.synth.speak(utter);
  }

  // 朗读中文意思
  speakChinese(text) {
    if (!this.enabled || !this.synth) return;
    this.cancel();

    const cleanZh = (text || '').replace(/[\(（].*?[\)）]/g, '').trim();
    const utter = new SpeechSynthesisUtterance(cleanZh);
    utter.rate = 1.15; // 轻快干脆
    utter.pitch = 1.05;

    const zhVoice = this.voices.find(v => v.lang.includes('zh') && (v.name.includes('Xiaoxiao') || v.name.includes('Google') || v.name.includes('Tingting') || v.name.includes('Mei-Jia')));
    if (zhVoice) {
      utter.voice = zhVoice;
    } else {
      const genericZh = this.voices.find(v => v.lang.startsWith('zh'));
      if (genericZh) utter.voice = genericZh;
    }

    this.currentUtterance = utter;
    this.synth.speak(utter);
  }

  // 双语连读：先读英文单词，完成后无缝衔接中文释义；全部朗读完毕后执行 onComplete 回调
  speakBilingual(word, chinese, onComplete) {
    if (!this.enabled || !this.synth) {
      if (typeof onComplete === 'function') {
        // 静音或不支持环境保持 350ms 舒适视觉停留
        setTimeout(onComplete, 350);
      }
      return;
    }

    this.cancel();
    const currentSession = this.sessionId;

    let finished = false;
    let fallbackTimer = null;

    const done = () => {
      if (currentSession !== this.sessionId) return;
      if (!finished) {
        finished = true;
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    };

    // 兜底超时：正常双语朗读约 1.2~1.8s，最长设定 3.2s，防浏览器 TTS 偶发挂起
    fallbackTimer = setTimeout(done, 3200);

    const utterEn = new SpeechSynthesisUtterance(word);
    utterEn.rate = 1.05; // 自然明快
    utterEn.pitch = 1.1;

    const enVoice = this.voices.find(v => (v.lang.includes('en-US') || v.lang.includes('en-GB')) && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Jenny'))) || this.voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterEn.voice = enVoice;

    // 清洗中文中的词性或说明括号（如 "你好 (日常问候)" -> "你好"），读音干净利落
    const cleanZh = (chinese || '').replace(/[\(（].*?[\)）]/g, '').trim();

    utterEn.onend = () => {
      if (currentSession !== this.sessionId) return;
      if (!this.enabled || !this.synth || !cleanZh) {
        done();
        return;
      }

      // 英文读完，立即紧跟中文
      const utterZh = new SpeechSynthesisUtterance(cleanZh);
      utterZh.rate = 1.15; // 中文轻快利落
      utterZh.pitch = 1.05;

      const zhVoice = this.voices.find(v => v.lang.includes('zh') && (v.name.includes('Xiaoxiao') || v.name.includes('Google') || v.name.includes('Tingting') || v.name.includes('Mei-Jia'))) || this.voices.find(v => v.lang.startsWith('zh'));
      if (zhVoice) utterZh.voice = zhVoice;

      utterZh.onend = () => {
        done();
      };
      utterZh.onerror = () => {
        done();
      };

      this.currentUtterance = utterZh;
      this.synth.speak(utterZh);
    };

    utterEn.onerror = () => {
      done();
    };

    this.currentUtterance = utterEn;
    this.synth.speak(utterEn);
  }

  // Mimimi 开场彩蛋：活泼萌萌少儿欢呼 "Yay! Kyrie's Typo!"
  playKidCheer() {
    if (!this.enabled || !this.synth) return;
    const utter = new SpeechSynthesisUtterance("Yay! Kyrie's Typo!");
    utter.rate = 1.2;
    utter.pitch = 1.45;
    const friendlyVoice = this.voices.find(v => (v.name.includes('Child') || v.name.includes('Junior') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Xiaoxiao')));
    if (friendlyVoice) utter.voice = friendlyVoice;
    this.synth.speak(utter);
  }

}


window.speechEngine = new SpeechEngine();
