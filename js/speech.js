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

  toggleSpeech() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // 朗读英文单词
  speakEnglish(text, rate = 0.88) {
    if (!this.enabled || !this.synth) return;
    this.synth.cancel(); // 停止前面的发音

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate; // 稍微放慢一点，儿童听得更清楚
    utter.pitch = 1.1; // 稍微活泼明亮的语调

    // 优先选择美音或英音儿童/女性友好声音
    const enVoice = this.voices.find(v => (v.lang.includes('en-US') || v.lang.includes('en-GB')) && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Jenny')));
    if (enVoice) {
      utter.voice = enVoice;
    } else {
      const genericEn = this.voices.find(v => v.lang.startsWith('en'));
      if (genericEn) utter.voice = genericEn;
    }

    this.synth.speak(utter);
  }

  // 朗读中文意思
  speakChinese(text) {
    if (!this.enabled || !this.synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.05;

    const zhVoice = this.voices.find(v => v.lang.includes('zh') && (v.name.includes('Xiaoxiao') || v.name.includes('Google') || v.name.includes('Tingting') || v.name.includes('Mei-Jia')));
    if (zhVoice) {
      utter.voice = zhVoice;
    } else {
      const genericZh = this.voices.find(v => v.lang.startsWith('zh'));
      if (genericZh) utter.voice = genericZh;
    }

    this.synth.speak(utter);
  }

  // 双语连读：先读英文单词，短暂间隔后读中文释义
  speakBilingual(word, chinese) {
    if (!this.enabled || !this.synth) return;
    this.synth.cancel();

    const utterEn = new SpeechSynthesisUtterance(word);
    utterEn.rate = 0.85;
    utterEn.pitch = 1.1;
    const enVoice = this.voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterEn.voice = enVoice;

    utterEn.onend = () => {
      // 英文读完，轻读中文释义
      setTimeout(() => {
        const utterZh = new SpeechSynthesisUtterance(chinese);
        utterZh.rate = 1.0;
        utterZh.pitch = 1.05;
        const zhVoice = this.voices.find(v => v.lang.startsWith('zh'));
        if (zhVoice) utterZh.voice = zhVoice;
        this.synth.speak(utterZh);
      }, 250);
    };

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
