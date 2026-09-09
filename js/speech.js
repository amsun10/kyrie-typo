// Kyrie Typo - 语音合成发音系统（支持中英文双语原声朗读）

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.enabled = true;
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

  // 朗读英文单词
  speakEnglish(text, rate = 1.05) {
    if (!this.enabled || !this.synth) return;
    this.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate; // 自然明快
    utter.pitch = 1.1; // 活泼明亮的语调

    // 优先选择美音或英音儿童/女性友好声音
    const enVoice = this.voices.find(v => (v.lang.includes('en-US') || v.lang.includes('en-GB')) && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Jenny')));
    if (enVoice) {
      utter.voice = enVoice;
    } else {
      const genericEn = this.voices.find(v => v.lang.startsWith('en'));
      if (genericEn) utter.voice = genericEn;
    }

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

  // 双语紧凑连读：先读英文单词，0延迟立即轻读中文释义（绝不延后串音到下个词）
  speakBilingual(word, chinese) {
    if (!this.enabled || !this.synth) return;
    this.cancel();

    const utterEn = new SpeechSynthesisUtterance(word);
    utterEn.rate = 1.05; // 轻快、标准
    utterEn.pitch = 1.1;
    const enVoice = this.voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterEn.voice = enVoice;

    // 清洗中文中的词性或说明括号（如 "你好 (日常问候)" -> "你好"），读音干净利落
    const cleanZh = (chinese || '').replace(/[\(（].*?[\)）]/g, '').trim();

    utterEn.onend = () => {
      if (!this.enabled || !this.synth) return;
      // 英文刚一读完，立即紧跟中文，0延迟无缝衔接
      const utterZh = new SpeechSynthesisUtterance(cleanZh);
      utterZh.rate = 1.15; // 中文轻快利落
      utterZh.pitch = 1.05;
      const zhVoice = this.voices.find(v => v.lang.startsWith('zh'));
      if (zhVoice) utterZh.voice = zhVoice;
      this.currentUtterance = utterZh;
      this.synth.speak(utterZh);
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
