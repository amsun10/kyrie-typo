// 极速挑战三阶难度预设（新手 20s/5命，进阶 10s/3命，大师 5s/1命极限）
const DIFFICULTY_PRESETS = {
  easy: {
    id: 'easy',
    name: '🌱 新手萌芽',
    shortTitle: '新手萌芽',
    badge: '🌱 20秒 · 5命',
    hudTag: '🌱 新手 (20s)',
    baseSeconds: 20.0,
    minSeconds: 10.0,
    lenBonusRatio: 0.8,
    lives: 5,
    medal: '🥉 萌芽小勇士',
    desc: '初始 20 秒宽裕答题，平缓收紧至 10 秒，5 条小心心从容练习！'
  },
  normal: {
    id: 'normal',
    name: '⚡ 进阶小侠',
    shortTitle: '进阶小侠',
    badge: '⚡ 10秒 · 3命',
    hudTag: '⚡ 进阶 (10s)',
    baseSeconds: 10.0,
    minSeconds: 4.5,
    lenBonusRatio: 0.4,
    lives: 3,
    medal: '🥈 闪电小飞侠',
    desc: '初始 10 秒标准节奏，适度收紧至 4.5 秒，3 条小心心张弛有度！'
  },
  hard: {
    id: 'hard',
    name: '🔥 键盘大师',
    shortTitle: '键盘大师',
    badge: '🔥 5秒 · 1命',
    hudTag: '🔥 大师 (1命)',
    baseSeconds: 5.0,
    minSeconds: 1.5,
    lenBonusRatio: 0.15,
    lives: 1,
    medal: '🥇 黄金大满贯',
    desc: '初始 5 秒极速压迫至 1.5 秒极限反应，仅 1 颗心（一命到底）！'
  }
};

class TypoGame {
  constructor() {
    this.mode = 'practice'; // 'practice' | 'challenge' | 'tutorial'
    this.wordsList = [];
    this.currentWordIdx = 0;
    this.currentCharIdx = 0;

    // 挑战模式专属状态与三阶难度设置
    let savedDiff = 'easy';
    try {
      if (typeof localStorage !== 'undefined') {
        savedDiff = localStorage.getItem('typo_challenge_diff') || 'easy';
      }
    } catch (e) {}
    this.difficulty = DIFFICULTY_PRESETS[savedDiff] ? savedDiff : 'easy';
    this.maxLives = DIFFICULTY_PRESETS[this.difficulty].lives;
    this.lives = this.maxLives;

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timerInterval = null;
    this.timeLeft = 0;
    this.maxTime = 5;
    this.challengeWordsCompleted = 0;
    this.wrongWordsList = []; // 错词复盘
    this.fastestTime = 999;
    this.fastestWord = "";
    this.wordStartTime = 0;

    // 实时打字速度测速（WPM / CPM / Q版动物段位）
    this.sessionStartTime = null;
    this.totalCorrectChars = 0;
    this.totalPressedChars = 0;
    this.currentWPM = 0;
    this.currentCPM = 0;

    this.maxChallengeWords = 30; // 30 词通关冲刺赛目标
    this.isVictory = false;

    // 词库与教材定向点播筛选状态（从 localStorage 安全持久化恢复）
    let savedFilter = { book: 'all', unit: 'all' };
    try {
      if (typeof window !== 'undefined' && window.scoreStorage && typeof window.scoreStorage.getWordFilter === 'function') {
        savedFilter = window.scoreStorage.getWordFilter();
      } else if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('kyrie_typo_word_filter');
        if (raw) savedFilter = JSON.parse(raw);
      }
    } catch (e) {}
    this.currentFilter = savedFilter || { book: 'all', unit: 'all' };

    // 事件监听回调
    this.onWordChange = null;
    this.onLetterHit = null;
    this.onLetterMiss = null;
    this.onWordComplete = null;
    this.onTimerTick = null;
    this.onGameOver = null;
    this.onVictory = null;
    this.onProgressUpdate = null;
    this.onComboChange = null;
    this.onScoreChange = null;
    this.onLivesChange = null;
    this.onSpeedUpdate = null;

    this.initWords();
  }

  // 获取难度预设配置字典
  getDifficultyPresets() {
    return DIFFICULTY_PRESETS;
  }

  getDifficultyPreset(diffKey = this.difficulty) {
    return DIFFICULTY_PRESETS[diffKey] || DIFFICULTY_PRESETS.easy;
  }

  setDifficulty(diffKey) {
    if (!DIFFICULTY_PRESETS[diffKey]) return this.getDifficultyPreset();
    this.difficulty = diffKey;
    const preset = DIFFICULTY_PRESETS[diffKey];
    this.maxLives = preset.lives;
    this.lives = preset.lives;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('typo_challenge_diff', diffKey);
      }
    } catch (e) {}
    if (this.onLivesChange) {
      this.onLivesChange(this.lives, this.maxLives);
    }
    return preset;
  }

  // 动态提取教材目录（按 苏教版 / 剑桥少儿 PU / 剑桥 KET 三大权威体系组织）
  getCurriculumCatalog() {
    const catalog = {
      all: { count: window.WORD_DATABASE ? window.WORD_DATABASE.length : 0 },
      groups: [
        {
          id: 'SJ',
          title: '🏫 苏教版小学英语 (译林版·三年级)',
          tag: '校内同步 · 115词',
          badge: '校内同步 · 115词',
          bookCodes: ['苏教3A', '苏教3B']
        },
        {
          id: 'PU',
          title: '📘 剑桥少儿英语 Power Up',
          tag: '经典核心 · 212词',
          badge: '经典核心 · 212词',
          bookCodes: ['PU1', 'PU2', 'PU3']
        },
        {
          id: 'KET',
          title: '🎓 剑桥 KET 考级核心词库 (A2 Key)',
          tag: '考级冲刺 · 598词',
          badge: '考级冲刺 · 598词',
          bookCodes: ['KET']
        }
      ],
      books: {}
    };
    if (!window.WORD_DATABASE) return catalog;

    window.WORD_DATABASE.forEach(w => {
      const b = w.book || 'PU1';
      const u = w.unit || 1;
      const cn = w.categoryCn || '';
      if (!catalog.books[b]) {
        let bTitle = b;
        if (b === '苏教3A') bTitle = '苏教版 3A (三年级上册)';
        else if (b === '苏教3B') bTitle = '苏教版 3B (三年级下册)';
        else if (b === 'PU1') bTitle = 'Power Up 1 全册';
        else if (b === 'PU2') bTitle = 'Power Up 2 全册';
        else if (b === 'PU3') bTitle = 'Power Up 3 (U1-U5)';
        else if (b === 'KET') bTitle = '剑桥 KET 考级 12 大黄金主题';

        catalog.books[b] = {
          code: b,
          title: bTitle,
          curriculum: w.curriculum || (b.startsWith('苏教') ? 'SJ' : (b === 'KET' ? 'KET' : 'PU')),
          count: 0,
          units: {}
        };
      }
      catalog.books[b].count++;
      if (!catalog.books[b].units[u]) {
        catalog.books[b].units[u] = {
          unit: u,
          book: b,
          name: cn,
          count: 0
        };
      }
      catalog.books[b].units[u].count++;
    });
    return catalog;
  }

  // 设定当前练习的教材范围（book: 'all' | 'SJ_ALL' | 'PU_ALL' | 'KET_ALL' | '苏教3A' | '苏教3B' | 'PU1' | 'KET'..., unit: 'all' | 1..12）
  setWordFilter(book = 'all', unit = 'all') {
    this.currentFilter = {
      book: book,
      unit: unit === 'all' ? 'all' : Number(unit)
    };
    try {
      if (typeof window !== 'undefined' && window.scoreStorage && typeof window.scoreStorage.setWordFilter === 'function') {
        window.scoreStorage.setWordFilter(this.currentFilter);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kyrie_typo_word_filter', JSON.stringify(this.currentFilter));
      }
    } catch (e) {}
    this.initWords();
    if (this.mode === 'practice') {
      this.emitWordChange();
    }
    return this.getFilterInfo();
  }

  // 获取当前筛选状态详情（含描述性标题与词数）
  getFilterInfo() {
    let list = window.WORD_DATABASE || [];
    if (this.currentFilter.book === 'SJ_ALL') {
      list = list.filter(w => w.curriculum === 'SJ' || (w.book && w.book.startsWith('苏教')));
    } else if (this.currentFilter.book === 'PU_ALL') {
      list = list.filter(w => w.curriculum === 'PU' || (w.book && w.book.startsWith('PU')));
    } else if (this.currentFilter.book === 'KET_ALL') {
      list = list.filter(w => w.curriculum === 'KET' || w.book === 'KET');
    } else if (this.currentFilter.book !== 'all') {
      list = list.filter(w => w.book === this.currentFilter.book);
      if (this.currentFilter.unit !== 'all') {
        list = list.filter(w => w.unit === Number(this.currentFilter.unit));
      }
    }

    let title = '全部教材大乱斗';
    let shortTitle = '全部教材';

    if (this.currentFilter.book === 'SJ_ALL') {
      title = '🏫 苏教版三年级全套 (3A+3B)';
      shortTitle = '苏教版全套';
    } else if (this.currentFilter.book === 'PU_ALL') {
      title = '📘 剑桥 Power Up 全套 (PU1~PU3)';
      shortTitle = 'Power Up 全套';
    } else if (this.currentFilter.book === 'KET_ALL') {
      title = '🎓 剑桥 KET 考级必背全套 (598词)';
      shortTitle = '剑桥 KET 全套';
    } else if (this.currentFilter.book !== 'all') {
      const isSJ = this.currentFilter.book.startsWith('苏教');
      const isKET = this.currentFilter.book === 'KET';
      const icon = isSJ ? '🏫' : (isKET ? '🎓' : '📘');
      if (this.currentFilter.unit !== 'all') {
        const sample = list[0];
        const unitName = sample ? sample.categoryCn : `第${this.currentFilter.unit}单元`;
        title = `${icon} ${this.currentFilter.book} · U${this.currentFilter.unit} ${unitName}`;
        shortTitle = `${this.currentFilter.book} · U${this.currentFilter.unit}`;
      } else {
        title = `${icon} ${this.currentFilter.book} 全库精练`;
        shortTitle = `${this.currentFilter.book} 全库`;
      }
    }

    return {
      book: this.currentFilter.book,
      unit: this.currentFilter.unit,
      count: list.length,
      title: title,
      shortTitle: shortTitle
    };
  }

  initWords() {
    let list = [...(window.WORD_DATABASE || [])];
    if (this.currentFilter.book === 'SJ_ALL') {
      list = list.filter(w => w.curriculum === 'SJ' || (w.book && w.book.startsWith('苏教')));
    } else if (this.currentFilter.book === 'PU_ALL') {
      list = list.filter(w => w.curriculum === 'PU' || (w.book && w.book.startsWith('PU')));
    } else if (this.currentFilter.book === 'KET_ALL') {
      list = list.filter(w => w.curriculum === 'KET' || w.book === 'KET');
    } else if (this.currentFilter.book !== 'all') {
      list = list.filter(w => w.book === this.currentFilter.book);
      if (this.currentFilter.unit !== 'all') {
        list = list.filter(w => w.unit === Number(this.currentFilter.unit));
      }
    }
    this.wordsList = list.length > 0 ? list : [...(window.WORD_DATABASE || [])];
    this.shuffle(this.wordsList);
    this.currentWordIdx = 0;
    this.currentCharIdx = 0;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  getCurrentWordObj() {
    return this.wordsList[this.currentWordIdx] || null;
  }

  getCurrentTargetChar() {
    const wordObj = this.getCurrentWordObj();
    if (!wordObj) return "";
    return wordObj.word[this.currentCharIdx] || "";
  }

  // 全局彻底重置所有游戏状态、倒计时与发音
  resetAll() {
    this.stopTimer();
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    const preset = this.getDifficultyPreset();
    this.maxLives = preset.lives;
    this.lives = preset.lives;
    this.currentCharIdx = 0;
    this.challengeWordsCompleted = 0;
    this.wrongWordsList = [];
    this.timeLeft = 0;
    this.mode = 'idle';

    // 重置打字速度统计
    this.sessionStartTime = null;
    this.totalCorrectChars = 0;
    this.totalPressedChars = 0;
    this.currentWPM = 0;
    this.currentCPM = 0;
    this.emitSpeed(0, 0);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (this.onScoreChange) this.onScoreChange(0);
    if (this.onComboChange) this.onComboChange(0);
    if (this.onLivesChange) this.onLivesChange(this.lives, this.maxLives);
    if (this.onTimerTick) this.onTimerTick(0, 1);
  }

  // 开始闯关练习模式
  startPracticeMode() {
    this.resetAll();
    this.mode = 'practice';
    this.initWords();
    this.emitWordChange();
  }

  // 开始极速挑战模式
  startChallengeMode(autoStartTimer = true) {
    this.resetAll();
    this.mode = 'challenge';
    this.fastestTime = 999;
    this.fastestWord = "";

    const preset = this.getDifficultyPreset();
    this.maxLives = preset.lives;
    this.lives = preset.lives;

    this.initWords();
    // 动态确定本局通关大满贯目标（不超过 30 词；若当前单元仅 8 词则以 8 词为大满贯目标）
    this.maxChallengeWords = Math.min(30, this.wordsList.length);
    this.challengeWordsCompleted = 0;

    if (this.onLivesChange) {
      this.onLivesChange(this.lives, this.maxLives);
    }
    this.loadChallengeWord(autoStartTimer);
  }

  // 加载挑战模式当前单词并启动动态倒计时（按三阶难度：新手 20s->10s, 进阶 10s->4.5s, 大师 5s->1.5s 极限值）
  loadChallengeWord(autoStartTimer = true) {
    if (this.challengeWordsCompleted >= this.maxChallengeWords) {
      this.handleChallengeVictory();
      return;
    }

    const wordObj = this.getCurrentWordObj();
    if (!wordObj) return;

    this.currentCharIdx = 0;
    this.wordStartTime = performance.now();

    // 动态时间紧迫递减计算（根据所选难度预设：新手/进阶/大师）
    const preset = this.getDifficultyPreset();
    const wordLen = wordObj.word.length;
    const denominator = Math.max(1, this.maxChallengeWords - 1);
    const progress = Math.min(1.0, this.challengeWordsCompleted / denominator);
    const baseSeconds = preset.baseSeconds - progress * (preset.baseSeconds - preset.minSeconds);
    const lenBonus = Math.max(0, (wordLen - 3) * preset.lenBonusRatio * (1 - progress * 0.5));
    const allowedSeconds = Math.max(preset.minSeconds, Math.round((baseSeconds + lenBonus) * 10) / 10);

    this.maxTime = allowedSeconds;
    this.timeLeft = allowedSeconds;

    this.emitWordChange();
    if (this.onTimerTick) {
      this.onTimerTick(this.timeLeft, this.maxTime);
    }
    if (this.onProgressUpdate) {
      this.onProgressUpdate(this.challengeWordsCompleted, this.maxChallengeWords);
    }
    if (autoStartTimer) {
      this.startChallengeTimer();
    }
  }

  startChallengeTimer() {
    this.stopTimer();
    this.isPaused = false;
    const intervalMs = 50;

    this.timerInterval = setInterval(() => {
      this.timeLeft -= intervalMs / 1000;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.handleChallengeTimeout();
      } else {
        if (this.onTimerTick) {
          this.onTimerTick(this.timeLeft, this.maxTime);
        }
      }
    }, intervalMs);
  }

  // 暂停挑战倒计时（防误触切出时不扣血）
  pauseChallengeTimer() {
    if (this.mode === 'challenge' && this.timerInterval) {
      this.stopTimer();
      this.isPaused = true;
    }
  }

  // 恢复挑战倒计时
  resumeChallengeTimer() {
    if (this.mode === 'challenge' && this.isPaused && this.timeLeft > 0) {
      this.startChallengeTimer();
    }
  }

  // 判断当前是否处于激烈进行中的有效挑战（用于退出拦截）
  isInActiveChallenge() {
    return this.mode === 'challenge' &&
           this.lives > 0 &&
           (this.score > 0 || this.challengeWordsCompleted > 0 || this.currentCharIdx > 0);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // 挑战模式超时处理
  handleChallengeTimeout() {
    this.stopTimer();
    const wordObj = this.getCurrentWordObj();
    if (wordObj && !this.wrongWordsList.some(w => w.word === wordObj.word)) {
      this.wrongWordsList.push(wordObj);
    }

    this.combo = 0;
    this.lives -= 1;
    if (this.onComboChange) this.onComboChange(this.combo);
    if (this.onLivesChange) this.onLivesChange(this.lives, this.maxLives);

    // 扣心音效（温和可爱的微水滴滑音，绝不挫败）
    if (window.soundFX && window.soundFX.playHeartLost) {
      window.soundFX.playHeartLost();
    } else {
      window.soundFX.playKeyWrong();
    }

    if (this.lives <= 0) {
      this.handleGameOver();
    } else {
      // 下一个单词
      setTimeout(() => {
        this.nextWord();
      }, 500);
    }
  }

  handleGameOver() {
    this.stopTimer();
    if (this.onGameOver) {
      this.onGameOver({
        score: this.score,
        wordsCount: this.challengeWordsCompleted,
        maxCombo: this.maxCombo,
        fastestWord: this.fastestWord,
        fastestTime: this.fastestTime === 999 ? 0 : this.fastestTime.toFixed(1),
        wrongWords: this.wrongWordsList,
        wpm: this.currentWPM,
        tier: this.getSpeedTier(this.currentWPM),
        difficulty: this.difficulty,
        difficultyPreset: this.getDifficultyPreset(),
        isVictory: false,
        maxWords: this.maxChallengeWords
      });
    }
  }

  // 30 词通关冲刺赛大满贯胜利！
  handleChallengeVictory() {
    this.stopTimer();
    this.isVictory = true;
    const victoryBonus = 3000;
    this.score += victoryBonus;

    if (this.onScoreChange) this.onScoreChange(this.score, victoryBonus);

    const resultData = {
      score: this.score,
      wordsCount: this.challengeWordsCompleted,
      maxCombo: this.maxCombo,
      fastestWord: this.fastestWord,
      fastestTime: this.fastestTime === 999 ? 0 : this.fastestTime.toFixed(1),
      wrongWords: this.wrongWordsList,
      wpm: this.currentWPM,
      tier: this.getSpeedTier(this.currentWPM),
      difficulty: this.difficulty,
      difficultyPreset: this.getDifficultyPreset(),
      isVictory: true,
      maxWords: this.maxChallengeWords
    };

    if (this.onVictory) {
      this.onVictory(resultData);
    } else if (this.onGameOver) {
      this.onGameOver(resultData);
    }
  }

  // 处理物理按键输入
  handleKeyInput(keyChar) {
    const wordObj = this.getCurrentWordObj();
    if (!wordObj) return;

    // 如果当前单词已经敲完、正处于双语朗读与转场中，暂不接收按键，防止误判
    if (this.currentCharIdx >= wordObj.word.length) return;

    if (!this.sessionStartTime) {
      this.sessionStartTime = performance.now();
    }
    this.totalPressedChars++;

    const targetChar = wordObj.word[this.currentCharIdx];
    if (keyChar.toLowerCase() === targetChar.toLowerCase()) {
      // 敲中正确字母
      this.handleCorrectLetter(targetChar);
    } else {
      // 按错字母
      this.handleWrongLetter(keyChar, targetChar);
    }
  }

  handleCorrectLetter(char) {
    const hitIdx = this.currentCharIdx;
    this.currentCharIdx++;
    this.totalCorrectChars++;
    this.updateSpeed();

    // 播放 Q 弹木琴音阶（高连击时音调逐级升高并带水晶泛音）
    window.soundFX.playKeyPop(hitIdx, this.combo);

    if (this.onLetterHit) {
      this.onLetterHit(hitIdx, char);
    }

    const wordObj = this.getCurrentWordObj();
    if (this.currentCharIdx >= wordObj.word.length) {
      // 整词敲击完成！
      this.handleWordComplete(wordObj);
    }
  }

  handleWrongLetter(pressedKey, expectedKey) {
    window.soundFX.playKeyWrong();

    // 敲错字母断连击（探索模式与挑战模式通用）
    if (this.combo > 0) {
      this.combo = 0;
      if (this.onComboChange) this.onComboChange(this.combo);
    }

    if (this.onLetterMiss) {
      this.onLetterMiss(this.currentCharIdx, pressedKey, expectedKey);
    }
  }

  handleWordComplete(wordObj) {
    const timeSpent = (performance.now() - this.wordStartTime) / 1000;
    if (timeSpent < this.fastestTime) {
      this.fastestTime = timeSpent;
      this.fastestWord = wordObj.word;
    }

    // 连击数立即自增
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    // 播放胜利和弦
    window.soundFX.playWordSuccess(this.combo);

    // 里程碑连击额外加持晶莹冲天琶音
    if (this.combo >= 3 && (this.combo % 3 === 0 || this.combo === 5 || this.combo === 10)) {
      window.soundFX.playComboSound(this.combo);
    }

    if (this.mode === 'challenge') {
      this.stopTimer();
      this.challengeWordsCompleted++;

      if (this.onProgressUpdate) {
        this.onProgressUpdate(this.challengeWordsCompleted, this.maxChallengeWords);
      }

      // 连击 5 次且未满血时回血奖励 1 颗心（大师模式 1 命到底不加血）
      if (this.combo === 5 && this.lives < this.maxLives && this.maxLives > 1) {
        this.lives = Math.min(this.maxLives, this.lives + 1);
        if (this.onLivesChange) this.onLivesChange(this.lives, this.maxLives);
      }

      // 计分公式：基础字数 * 15 + 速度剩余奖励 * 50 + 连击加权
      const speedBonusRatio = Math.max(0, this.timeLeft / this.maxTime);
      const speedPoints = Math.round(speedBonusRatio * 50);
      const basePoints = wordObj.word.length * 15;
      const comboMultiplier = 1 + Math.min(this.combo * 0.2, 2.0);
      const earned = Math.round((basePoints + speedPoints) * comboMultiplier);

      this.score += earned;

      if (this.onScoreChange) this.onScoreChange(this.score, earned);
      if (this.onComboChange) this.onComboChange(this.combo);

      // 检查是否已达成 30 词通关大满贯！
      if (this.challengeWordsCompleted >= this.maxChallengeWords) {
        if (this.onWordComplete) {
          this.onWordComplete(wordObj);
        }
        // 极速挑战通关：留 220ms 绽放完爆炸礼花后进入结算
        setTimeout(() => {
          this.handleChallengeVictory();
        }, 220);
        return;
      }
    } else {
      // 单词探索模式连击计数与音效激励
      if (this.onComboChange) this.onComboChange(this.combo);
    }

    if (this.onWordComplete) {
      this.onWordComplete(wordObj);
    }

    // 单词探索与极速挑战统一：打完单词引爆七彩星光，220ms 极速切词（发音前移至新词登场时，打完专心享受爆炸打击感）
    setTimeout(() => {
      this.nextWord();
    }, 220);
  }

  nextWord() {
    // 彻底清除上一词的发音队列，绝不允许串音到新单词！
    if (window.speechEngine) {
      window.speechEngine.cancel();
    }

    this.currentWordIdx++;
    if (this.currentWordIdx >= this.wordsList.length) {
      this.shuffle(this.wordsList);
      this.currentWordIdx = 0;
    }

    if (this.mode === 'challenge') {
      this.loadChallengeWord();
    } else {
      this.currentCharIdx = 0;
      this.emitWordChange();
    }
  }

  emitWordChange() {
    const wordObj = this.getCurrentWordObj();
    if (this.onWordChange && wordObj) {
      this.onWordChange(wordObj, this.currentCharIdx);
    }
  }

  // 实时打字速度计算 (WPM & CPM)
  updateSpeed() {
    if (!this.sessionStartTime) return;
    const elapsedSeconds = (performance.now() - this.sessionStartTime) / 1000;
    if (elapsedSeconds < 0.4) return;

    const elapsedMinutes = elapsedSeconds / 60;
    // 标准 WPM: (击对字符数 / 5) / 分钟
    const wpm = Math.max(1, Math.round((this.totalCorrectChars / 5) / elapsedMinutes));
    // 敲击 CPM: 击对字符数 / 分钟
    const cpm = Math.max(1, Math.round(this.totalCorrectChars / elapsedMinutes));

    this.currentWPM = wpm;
    this.currentCPM = cpm;
    this.emitSpeed(wpm, cpm);
  }

  // Q 版动物速度段位等级
  getSpeedTier(wpm) {
    if (wpm >= 55) {
      return { icon: '🚀', tier: '超光速火箭', praise: '神速小天才！', color: '#EC4899', class: 'tier-rocket' };
    } else if (wpm >= 40) {
      return { icon: '⚡', tier: '闪电小飞侠', praise: '健步如飞无影手！', color: '#EAB308', class: 'tier-lightning' };
    } else if (wpm >= 25) {
      return { icon: '🐆', tier: '旋风小猎豹', praise: '飞奔冲刺超给力！', color: '#F97316', class: 'tier-cheetah' };
    } else if (wpm >= 12) {
      return { icon: '🐇', tier: '敏捷小萌兔', praise: '蹦蹦跳跳敲得准！', color: '#10B981', class: 'tier-rabbit' };
    } else {
      return { icon: '🐢', tier: '稳步小乌龟', praise: '一步一个脚印练习中', color: '#38BDF8', class: 'tier-turtle' };
    }
  }

  emitSpeed(wpm, cpm) {
    const tier = this.getSpeedTier(wpm);
    if (this.onSpeedUpdate) {
      this.onSpeedUpdate(wpm, tier, cpm);
    }
  }
}

window.typoGame = new TypoGame();
