// Kyrie Typo - 游戏核心状态与逻辑控制（支持闯关模式、极速挑战模式）

class TypoGame {
  constructor() {
    this.mode = 'practice'; // 'practice' | 'challenge' | 'tutorial'
    this.wordsList = [];
    this.currentWordIdx = 0;
    this.currentCharIdx = 0;

    // 挑战模式专属状态
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
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

  initWords() {
    this.wordsList = [...window.WORD_DATABASE];
    this.shuffle(this.wordsList);
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
    this.lives = 3;
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
    if (this.onLivesChange) this.onLivesChange(3);
    if (this.onTimerTick) this.onTimerTick(0, 1);
  }

  // 开始闯关练习模式
  startPracticeMode(category = 'all', level = 1) {
    this.resetAll();
    this.mode = 'practice';


    let filtered = window.WORD_DATABASE;
    if (category !== 'all') {
      filtered = filtered.filter(w => w.category === category);
    }
    if (level > 0) {
      filtered = filtered.filter(w => w.level <= level);
    }
    this.wordsList = filtered.length > 0 ? [...filtered] : [...window.WORD_DATABASE];
    this.shuffle(this.wordsList);

    this.currentWordIdx = 0;
    this.currentCharIdx = 0;
    this.emitWordChange();
  }

  // 开始极速挑战模式
  startChallengeMode(autoStartTimer = true) {
    this.resetAll();
    this.mode = 'challenge';
    this.fastestTime = 999;
    this.fastestWord = "";

    // 挑战模式混合由浅入深的全部词汇
    this.wordsList = [...window.WORD_DATABASE].sort((a, b) => a.level - b.level);
    this.shuffle(this.wordsList);

    this.currentWordIdx = 0;
    this.currentCharIdx = 0;

    this.loadChallengeWord(autoStartTimer);
  }

  // 加载挑战模式当前单词并启动动态倒计时（30词极速马拉松，给时平滑递减压迫至 1.5s 极限值）
  loadChallengeWord(autoStartTimer = true) {
    if (this.challengeWordsCompleted >= this.maxChallengeWords) {
      this.handleChallengeVictory();
      return;
    }

    const wordObj = this.getCurrentWordObj();
    if (!wordObj) return;

    this.currentCharIdx = 0;
    this.wordStartTime = performance.now();

    // 动态时间紧迫递减计算：从初始 5.2 秒平滑收紧至 1.5 秒极限最小值
    const wordLen = wordObj.word.length;
    const progress = Math.min(1.0, this.challengeWordsCompleted / (this.maxChallengeWords - 1));
    const baseSeconds = 5.2 - progress * (5.2 - 1.5);
    const lenBonus = Math.max(0, (wordLen - 3) * 0.22 * (1 - progress * 0.65));
    const allowedSeconds = Math.max(1.5, Math.round((baseSeconds + lenBonus) * 10) / 10);

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
    if (this.onLivesChange) this.onLivesChange(this.lives);

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

    // 播放胜利和弦（传入递增后的连击数，实现音调阶梯式华丽攀升！）
    window.soundFX.playWordSuccess(this.combo);
    window.speechEngine.speakBilingual(wordObj.word, wordObj.chinese);

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

      // 连击 5 次回血奖励半颗心
      if (this.combo === 5 && this.lives < 3) {
        this.lives = Math.min(3, this.lives + 1);
        if (this.onLivesChange) this.onLivesChange(this.lives);
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
        setTimeout(() => {
          this.handleChallengeVictory();
        }, 900);
        return;
      }
    } else {
      // 单词探索模式连击计数与音效激励
      if (this.onComboChange) this.onComboChange(this.combo);
    }

    if (this.onWordComplete) {
      this.onWordComplete(wordObj);
    }

    // 延迟过渡到下一个词，给孩子看动画和听发音
    setTimeout(() => {
      this.nextWord();
    }, 1100);
  }

  nextWord() {
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
