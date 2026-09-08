// Kyrie's Topo - 本地存储与得分排行榜管理引擎 (localStorage Safe Storage)

(function () {
  const SCORES_KEY = 'kyrie_topo_leaderboard_v1';
  const PLAYER_NAME_KEY = 'kyrie_topo_player_name';
  const MAX_STORED_RECORDS = 50;

  class ScoreStorage {
    constructor() {
      this.isAvailable = this.testStorage();
      this.memoryScores = [];
      this.memoryPlayerName = 'Kyrie';
    }

    testStorage() {
      try {
        const testKey = '__kyrie_storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        console.warn('localStorage 不可用，将自动使用内存临时存储：', e);
        return false;
      }
    }

    hasCustomName() {
      if (this.isAvailable) {
        try {
          const stored = localStorage.getItem(PLAYER_NAME_KEY);
          return !!(stored && stored.trim());
        } catch (e) {
          return false;
        }
      }
      return !!(this.memoryPlayerName && this.memoryPlayerName.trim());
    }

    getPlayerName() {
      if (this.isAvailable) {
        try {
          const stored = localStorage.getItem(PLAYER_NAME_KEY);
          if (stored && stored.trim()) {
            return stored.trim();
          }
        } catch (e) {
          console.error('读取玩家名字失败：', e);
        }
      }
      return this.memoryPlayerName || 'Kyrie';
    }

    setPlayerName(name) {
      const cleanName = (name || '').trim().slice(0, 12) || 'Kyrie';
      this.memoryPlayerName = cleanName;
      if (this.isAvailable) {
        try {
          localStorage.setItem(PLAYER_NAME_KEY, cleanName);
        } catch (e) {
          console.error('保存玩家名字失败：', e);
        }
      }
      return cleanName;
    }

    getScores() {
      if (this.isAvailable) {
        try {
          const raw = localStorage.getItem(SCORES_KEY);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              return list;
            }
          }
        } catch (e) {
          console.error('读取排行榜失败：', e);
        }
      }
      return this.memoryScores;
    }

    formatDate(date) {
      const pad = (n) => (n < 10 ? '0' + n : n);
      const m = pad(date.getMonth() + 1);
      const d = pad(date.getDate());
      const h = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${m}/${d} ${h}:${min}`;
    }

    saveScore(report) {
      const now = new Date();
      const currentBest = this.getBestScore();
      const playerName = this.getPlayerName();

      const newRecord = {
        id: 'rec_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        name: playerName,
        score: Math.max(0, parseInt(report.score, 10) || 0),
        wordsCount: Math.max(0, parseInt(report.wordsCount, 10) || 0),
        maxCombo: Math.max(0, parseInt(report.maxCombo, 10) || 0),
        wpm: Math.max(0, parseInt(report.wpm, 10) || 0),
        tierIcon: (report.tier && report.tier.icon) ? report.tier.icon : '🐢',
        tierName: (report.tier && report.tier.tier) ? report.tier.tier : '稳步小乌龟',
        tierColor: (report.tier && report.tier.color) ? report.tier.color : '#38BDF8',
        fastestTime: report.fastestTime > 0 ? report.fastestTime : 0,
        fastestWord: report.fastestWord || '',
        dateStr: this.formatDate(now),
        timestamp: Date.now()
      };

      const list = this.getScores();
      list.push(newRecord);

      // 综合排序规则：
      // 1. 分数降序
      // 2. 打字速度 WPM 降序
      // 3. 最大连击降序
      // 4. 最新时间戳降序
      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        if (b.maxCombo !== a.maxCombo) return b.maxCombo - a.maxCombo;
        return b.timestamp - a.timestamp;
      });

      // 截取前 50 条保留在存储中
      const trimmedList = list.slice(0, MAX_STORED_RECORDS);

      if (this.isAvailable) {
        try {
          localStorage.setItem(SCORES_KEY, JSON.stringify(trimmedList));
        } catch (e) {
          console.error('存储排行榜得分失败：', e);
        }
      }
      this.memoryScores = trimmedList;

      const rankIndex = trimmedList.findIndex(r => r.id === newRecord.id);
      const rank = rankIndex !== -1 ? rankIndex + 1 : trimmedList.length;
      const isNewBest = (!currentBest || newRecord.score > currentBest.score) && newRecord.score > 0;

      return {
        record: newRecord,
        rank: rank,
        isNewBest: isNewBest,
        totalScores: trimmedList.length
      };
    }

    getBestScore() {
      const list = this.getScores();
      return list.length > 0 ? list[0] : null;
    }

    clearScores() {
      this.memoryScores = [];
      if (this.isAvailable) {
        try {
          localStorage.removeItem(SCORES_KEY);
        } catch (e) {
          console.error('清空排行榜记录失败：', e);
        }
      }
      return true;
    }
  }

  window.scoreStorage = new ScoreStorage();
})();
