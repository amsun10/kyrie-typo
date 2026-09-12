// Kyrie Typo - 核心交互、按键事件与界面渲染中枢

/**
 * 动态视口自适应缩放：根据浏览器视口高度自动计算 zoom，
 * 让页面内容恰好铺满一屏，完美适配 1080P ~ 2K 屏幕。
 * 等价于浏览器 Ctrl+/- 缩放，但完全自动。
 */
function autoFitViewport() {
  const root = document.documentElement;
  // 临时重置 zoom 为 1，获取真实物理视口高度与实际自然高度
  root.style.zoom = '1';
  const vh = window.innerHeight;

  // 基准设计高度：1200px。在自适应基准上整体微调增加 5%（* 1.05），使视觉更精致紧凑
  const designH = 1200;

  // 计算缩放因子并在原基础上微增 5%（下限 0.55 支持小屏，上限 1.25 防过大）
  const zoom = Math.max(0.55, Math.min((vh / designH) * 1.05, 1.25));

  // 应用缩放（重置和赋值在同一同步帧，浏览器只渲染最终值，零闪烁）
  root.style.zoom = zoom;
}

// 页面加载时立即执行（尽早避免内容溢出闪现）
autoFitViewport();

// 窗口大小改变时（拖拽、切屏、全屏）防抖重算
let _fitTimer;
window.addEventListener('resize', () => {
  clearTimeout(_fitTimer);
  _fitTimer = setTimeout(autoFitViewport, 120);
});

document.addEventListener('DOMContentLoaded', () => {
  // DOM 元素引用
  const tabPractice = document.getElementById('tabPractice');
  const tabChallenge = document.getElementById('tabChallenge');
  const tabTutorial = document.getElementById('tabTutorial');
  const btnLogo = document.getElementById('btnLogo');

  const wordArena = document.getElementById('wordArena');
  const tutorialArena = document.getElementById('tutorialArena');
  const challengeHudContent = document.getElementById('challengeHudContent');
  const practiceHudContent = document.getElementById('practiceHudContent');
  const tutorialHudContent = document.getElementById('tutorialHudContent');
  const consoleTimerTrack = document.getElementById('consoleTimerTrack');

  const challengeCountdownOverlay = document.getElementById('challengeCountdownOverlay');
  const countdownNum = document.getElementById('countdownNum');
  const countdownTip = document.getElementById('countdownTip');

  const challengeStartModal = document.getElementById('challengeStartModal');
  const startModalTitle = document.getElementById('startModalTitle');
  const startModalBadge = document.getElementById('startModalBadge');
  const startModalScopeChip = document.getElementById('startModalScopeChip');
  const ruleTargetText = document.getElementById('ruleTargetText');
  const btnChallengeConfirm = document.getElementById('btnChallengeConfirm');
  const btnChallengeCancel = document.getElementById('btnChallengeCancel');
  const challengeProgressText = document.getElementById('challengeProgressText');
  const challengeScopeBadge = document.getElementById('challengeScopeBadge');

  const curriculumPicker = document.getElementById('curriculumPicker');
  const btnCurriculumTrigger = document.getElementById('btnCurriculumTrigger');
  const currSelectedLabel = document.getElementById('currSelectedLabel');
  const curriculumDropdown = document.getElementById('curriculumDropdown');
  const currBooksContainer = document.getElementById('currBooksContainer');
  const currUnitCountBadge = document.getElementById('currUnitCountBadge');

  const exitConfirmModal = document.getElementById('exitConfirmModal');
  const exitCurrentScore = document.getElementById('exitCurrentScore');
  const exitCurrentLives = document.getElementById('exitCurrentLives');
  const btnExitResume = document.getElementById('btnExitResume');
  const btnExitLeave = document.getElementById('btnExitLeave');

  const puBadge = document.getElementById('puBadge');
  const wordEmoji = document.getElementById('wordEmoji');
  const bubblesContainer = document.getElementById('bubblesContainer');
  const chinesePill = document.getElementById('chinesePill');
  const chineseText = document.getElementById('chineseText');
  const fingerBadge = document.getElementById('fingerBadge');
  const fingerTipBar = document.getElementById('fingerTipBar');

  const scoreVal = document.getElementById('scoreVal');
  const comboBadge = document.getElementById('comboBadge');
  const timerFill = document.getElementById('timerFill');
  const livesBox = document.getElementById('livesBox');
  const challengeDiffBadge = document.getElementById('challengeDiffBadge');
  const diffSelectorDeck = document.getElementById('diffSelectorDeck');
  const stripTimerVal = document.getElementById('stripTimerVal');
  const stripLivesVal = document.getElementById('stripLivesVal');

  // 教程元素
  const stepChips = document.querySelectorAll('.step-chip');
  const tutorialBadge = document.getElementById('tutorialBadge');
  const tutorialTitle = document.getElementById('tutorialTitle');
  const tutorialDesc = document.getElementById('tutorialDesc');
  const tutorialPromptBox = document.getElementById('tutorialPromptBox');
  const tutorialHint = document.getElementById('tutorialHint');
  const btnNextStep = document.getElementById('btnNextStep');

  // 结算弹窗元素
  const reportModal = document.getElementById('reportModal');
  const reportModalTitle = document.getElementById('reportModalTitle');
  const reportModalTrophy = document.getElementById('reportModalTrophy');
  const resScore = document.getElementById('resScore');
  const resWords = document.getElementById('resWords');
  const resCombo = document.getElementById('resCombo');
  const resFastest = document.getElementById('resFastest');
  const resSpeed = document.getElementById('resSpeed');
  const wrongWordsBox = document.getElementById('wrongWordsBox');
  const wrongTags = document.getElementById('wrongTags');
  const btnRestartChallenge = document.getElementById('btnRestartChallenge');
  const reportRankBadge = document.getElementById('reportRankBadge');
  const reportRankIcon = document.getElementById('reportRankIcon');
  const reportRankText = document.getElementById('reportRankText');
  const btnOpenLeaderboardFromReport = document.getElementById('btnOpenLeaderboardFromReport');

  // 排行榜弹窗元素
  const btnOpenLeaderboard = document.getElementById('btnOpenLeaderboard');
  const leaderboardModal = document.getElementById('leaderboardModal');
  const btnCloseLeaderboard = document.getElementById('btnCloseLeaderboard');
  const btnCloseLeaderboardBottom = document.getElementById('btnCloseLeaderboardBottom');
  const playerNicknameInput = document.getElementById('playerNicknameInput');
  const btnSaveNickname = document.getElementById('btnSaveNickname');
  const nameSaveTip = document.getElementById('nameSaveTip');
  const leaderboardList = document.getElementById('leaderboardList');
  const btnClearScores = document.getElementById('btnClearScores');
  let lastPlayedRecordId = null;

  // 打字手速仪表盘元素
  const speedBadge = document.getElementById('speedBadge');
  const speedAnimalIcon = document.getElementById('speedAnimalIcon');
  const speedVal = document.getElementById('speedVal');
  const speedTierLbl = document.getElementById('speedTierLbl');

  // 音频与全屏切换
  const btnToggleSound = document.getElementById('btnToggleSound');
  const btnToggleSpeech = document.getElementById('btnToggleSpeech');
  const btnToggleFullscreen = document.getElementById('btnToggleFullscreen');

  // 开场动画元素
  const mimimiSplash = document.getElementById('mimimiSplash');
  const mimimiStars = document.getElementById('mimimiStars');
  const btnStartGame = document.getElementById('btnStartGame');
  const splashWarriorCard = document.getElementById('splashWarriorCard');
  const warriorRegisterBox = document.getElementById('warriorRegisterBox');
  const warriorGreetingBox = document.getElementById('warriorGreetingBox');
  const splashWarriorInput = document.getElementById('splashWarriorInput');
  const warriorCurrentName = document.getElementById('warriorCurrentName');
  const btnEditHeroName = document.getElementById('btnEditHeroName');
  const mimimiClickTip = document.getElementById('mimimiClickTip');
  let splashTimer = null;

  // 键盘布局切换元素 (默认 PC)
  const btnLayoutPC = document.getElementById('btnLayoutPC');
  const btnLayoutMac = document.getElementById('btnLayoutMac');
  const tutorialDeckPill = document.getElementById('tutorialDeckPill');
  const lblBackspace = document.getElementById('lblBackspace');
  const lblEnter = document.getElementById('lblEnter');
  const kbdBottomRow = document.getElementById('kbdBottomRow');
  let currentKeyboardLayout = 'pc'; // 默认 PC

  let currentActiveTab = 'practice'; // 'practice' | 'challenge' | 'tutorial'

  // ================= Mimimi 风格单次开场弹射动画 =================
  function updateSplashWarriorCard() {
    if (!splashWarriorCard) return;
    const hasRegistered = window.scoreStorage && window.scoreStorage.hasCustomName();
    if (hasRegistered) {
      const currentName = window.scoreStorage.getPlayerName();
      if (warriorGreetingBox) warriorGreetingBox.style.display = 'flex';
      if (warriorRegisterBox) warriorRegisterBox.style.display = 'none';
      if (warriorCurrentName) warriorCurrentName.textContent = currentName;
      if (btnStartGame) btnStartGame.textContent = '🚀 开始打字冒险 ➔';
      if (mimimiClickTip) mimimiClickTip.textContent = '✨ 敲击键盘任意键或点击开始 ✨';
    } else {
      if (warriorGreetingBox) warriorGreetingBox.style.display = 'none';
      if (warriorRegisterBox) warriorRegisterBox.style.display = 'flex';
      if (splashWarriorInput) splashWarriorInput.value = '';
      if (btnStartGame) btnStartGame.textContent = '🚀 注册并启程冒险 ➔';
      if (mimimiClickTip) mimimiClickTip.textContent = '✨ 起好勇士名字后按回车或点击启程 ✨';
      setTimeout(() => {
        if (splashWarriorInput && mimimiSplash && !mimimiSplash.classList.contains('hidden')) {
          splashWarriorInput.focus();
        }
      }, 700);
    }
  }

  function playMimimiAnimation() {
    if (!mimimiSplash) return;
    if (splashTimer) clearTimeout(splashTimer);

    mimimiSplash.classList.remove('hidden');
    updateSplashWarriorCard();

    // 重新触发字符关键帧物理弹跳
    const chars = mimimiSplash.querySelectorAll('.m-char');
    chars.forEach(c => {
      c.style.animation = 'none';
      void c.offsetHeight;
      c.style.animation = '';
    });

    const badge = mimimiSplash.querySelector('.mimimi-badge');
    if (badge) {
      badge.style.animation = 'none';
      void badge.offsetHeight;
      badge.style.animation = '';
    }

    if (splashWarriorCard) {
      splashWarriorCard.style.animation = 'none';
      void splashWarriorCard.offsetHeight;
      splashWarriorCard.style.animation = '';
    }

    spawnStarsBurst();

    // 尝试轻和弦音效（若浏览器策略限制，用户点击/按键进入时会百分之百触发）
    window.soundFX.playSimpleIntro();
  }

  function spawnStarsBurst() {
    if (!mimimiStars) return;
    mimimiStars.innerHTML = '';
    const starEmojis = ['⭐', '✨', '🌟', '💥', '🎉', '💫'];

    for (let i = 0; i < 16; i++) {
      const star = document.createElement('span');
      star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
      star.style.position = 'absolute';
      star.style.fontSize = `${Math.random() * 1.6 + 1.1}rem`;
      star.style.left = '50%';
      star.style.top = '48%';
      star.style.userSelect = 'none';
      star.style.pointerEvents = 'none';

      const angle = (i / 16) * 360 + (Math.random() * 20 - 10);
      const dist = Math.random() * 200 + 140;
      const rad = (angle * Math.PI) / 180;
      const tx = Math.cos(rad) * dist;
      const ty = Math.sin(rad) * dist;

      star.style.transform = 'translate(-50%, -50%) scale(0)';
      star.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease';

      mimimiStars.appendChild(star);

      setTimeout(() => {
        star.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${Math.random() * 0.8 + 0.8}) rotate(${Math.random() * 360}deg)`;
        star.style.opacity = '0.9';
      }, 200);

      setTimeout(() => {
        star.style.opacity = '0';
      }, 1100);
    }
  }

  function closeMimimiSplash() {
    if (splashTimer) clearTimeout(splashTimer);
    if (mimimiSplash) {
      mimimiSplash.classList.add('hidden');
    }
  }

  // 统一解散开场画面并触发灵动上升和弦
  function dismissSplashAndEnter() {
    if (!mimimiSplash || mimimiSplash.classList.contains('hidden')) return;
    window.soundFX.playSimpleIntro();
    closeMimimiSplash();
    if (window.typoGame && window.typoGame.mode === 'practice' && typeof showReadyEnterPrompt === 'function') {
      showReadyEnterPrompt();
    }
  }

  // 保存勇士名字并启程
  function saveWarriorNameAndEnter() {
    if (warriorRegisterBox && warriorRegisterBox.style.display !== 'none' && splashWarriorInput) {
      const inputVal = splashWarriorInput.value.trim();
      const savedName = window.scoreStorage ? window.scoreStorage.setPlayerName(inputVal || 'Kyrie') : (inputVal || 'Kyrie');
      if (warriorCurrentName) warriorCurrentName.textContent = savedName;
      if (playerNicknameInput) playerNicknameInput.value = savedName;
    }
    dismissSplashAndEnter();
  }

  // 点击“修改勇士名字”
  if (btnEditHeroName) {
    btnEditHeroName.addEventListener('click', (e) => {
      e.stopPropagation();
      if (warriorGreetingBox) warriorGreetingBox.style.display = 'none';
      if (warriorRegisterBox) warriorRegisterBox.style.display = 'flex';
      if (splashWarriorInput) {
        splashWarriorInput.value = window.scoreStorage ? window.scoreStorage.getPlayerName() : 'Kyrie';
        splashWarriorInput.focus();
        splashWarriorInput.select();
      }
      if (btnStartGame) btnStartGame.textContent = '🚀 保存并启程冒险 ➔';
      if (mimimiClickTip) mimimiClickTip.textContent = '✨ 按回车或点击按钮完成修改并开始 ✨';
    });
  }

  // 输入框回车快速开始
  if (splashWarriorInput) {
    splashWarriorInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveWarriorNameAndEnter();
      }
    });
  }

  // 点击勇士卡片内部不触发背景关闭
  if (splashWarriorCard) {
    splashWarriorCard.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });
  }

  // 点击“开始打字冒险”按钮切入游戏
  if (btnStartGame) {
    btnStartGame.addEventListener('click', (e) => {
      e.stopPropagation();
      saveWarriorNameAndEnter();
    });
  }

  // 点击开场屏幕任意处切入游戏
  if (mimimiSplash) {
    mimimiSplash.addEventListener('pointerdown', (e) => {
      if (e.target && e.target.closest('#splashWarriorCard')) return;
      const isInputting = warriorRegisterBox && warriorRegisterBox.style.display !== 'none';
      const hasCustom = window.scoreStorage && window.scoreStorage.hasCustomName();
      if (!hasCustom || isInputting) {
        if (splashWarriorInput) splashWarriorInput.focus();
        return;
      }
      dismissSplashAndEnter();
    });
  }

  // 点击顶部 Logo 随时重温弹射动画与和弦
  btnLogo.addEventListener('click', () => {
    playMimimiAnimation();
  });

  // ================= 键盘 PC / Mac 布局切换引擎（默认 PC） =================
  function setKeyboardLayout(layout) {
    currentKeyboardLayout = layout;
    window.keyboardGuide.setLayout(layout);

    const iconEnter = document.getElementById('iconEnter');

    if (layout === 'pc') {
      btnLayoutPC.classList.add('active');
      btnLayoutMac.classList.remove('active');
      if (lblBackspace) lblBackspace.textContent = 'Backspace';
      if (lblEnter) lblEnter.textContent = 'Enter';
      if (iconEnter) iconEnter.textContent = '↵';

      // 渲染 PC 底栏（规范结构，绝不溢出）
      kbdBottomRow.innerHTML = `
        <div class="apple-key k-func k-ctrl" data-key="Control"><span class="func-icon">Ctrl</span></div>
        <div class="apple-key k-func k-win" data-key="Meta"><span class="func-icon">⊞</span><span class="func-label">Win</span></div>
        <div class="apple-key k-func k-alt" data-key="Alt"><span class="func-icon">Alt</span></div>
        <div class="apple-key k-func k-space" data-key=" " data-finger="thumb">
          <span class="space-title">Space</span>
          <span class="space-sub">空格跳跳床</span>
        </div>
        <div class="apple-key k-func k-alt" data-key="Alt"><span class="func-icon">Alt</span></div>
        <div class="apple-key k-func k-win" data-key="Meta"><span class="func-icon">⊞</span><span class="func-label">Win</span></div>
        <div class="apple-key k-func k-ctrl" data-key="Control"><span class="func-icon">Ctrl</span></div>
      `;
    } else {
      btnLayoutMac.classList.add('active');
      btnLayoutPC.classList.remove('active');
      if (lblBackspace) lblBackspace.textContent = 'delete';
      if (lblEnter) lblEnter.textContent = 'return';
      if (iconEnter) iconEnter.textContent = '↩';

      // 渲染 Mac 底栏（图标居上、名称居下，完美贴合苹果键盘原生美感）
      kbdBottomRow.innerHTML = `
        <div class="apple-key k-func k-ctrl" data-key="Control"><span class="func-icon">⌃</span><span class="func-label">control</span></div>
        <div class="apple-key k-func k-opt" data-key="Alt"><span class="func-icon">⌥</span><span class="func-label">option</span></div>
        <div class="apple-key k-func k-cmd" data-key="Meta"><span class="func-icon">⌘</span><span class="func-label">command</span></div>
        <div class="apple-key k-func k-space" data-key=" " data-finger="thumb">
          <span class="space-title">Space</span>
          <span class="space-sub">空格跳跳床</span>
        </div>
        <div class="apple-key k-func k-cmd" data-key="Meta"><span class="func-icon">⌘</span><span class="func-label">command</span></div>
        <div class="apple-key k-func k-opt" data-key="Alt"><span class="func-icon">⌥</span><span class="func-label">option</span></div>
      `;
    }

    // 为重新渲染的底栏键绑定点击事件
    bindKeyElementsEvents();

    if (currentActiveTab === 'tutorial') {
      if (window.keyboardGuide.activeGuideTab === 'quest') {
        renderTutorialStep();
      } else if (window.keyboardGuide.activeGuideTab === 'funckeys') {
        renderFuncKeysGrid();
      }
    }
  }

  btnLayoutPC.addEventListener('click', () => {
    window.soundFX.playTabSwitch();
    setKeyboardLayout('pc');
    showModeToast('💻', '已切换为 💻 PC (Windows) 键盘模式');
  });

  btnLayoutMac.addEventListener('click', () => {
    window.soundFX.playTabSwitch();
    setKeyboardLayout('mac');
    showModeToast('🍎', '已切换为 🍎 Mac (苹果) 键盘模式');
  });

  // 模式切换提示气泡
  const modeSwitchToast = document.getElementById('modeSwitchToast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showModeToast(icon, message) {
    if (!modeSwitchToast) return;
    if (toastTimer) clearTimeout(toastTimer);

    toastIcon.textContent = icon;
    toastMsg.textContent = message;
    modeSwitchToast.classList.add('show');

    toastTimer = setTimeout(() => {
      modeSwitchToast.classList.remove('show');
    }, 1500);
  }

  // ================= 极速挑战 3, 2, 1 倒计时与中途离开确认控制 =================
  let isCountdownActive = false;
  let countdownTimerId = null;
  let pendingSwitchMode = null;

  function cancelChallengeCountdown() {
    if (countdownTimerId) {
      clearTimeout(countdownTimerId);
      countdownTimerId = null;
    }
    isCountdownActive = false;
    if (challengeCountdownOverlay) {
      challengeCountdownOverlay.style.display = 'none';
    }
  }

  function startChallengeCountdown(onComplete) {
    cancelChallengeCountdown();
    if (!challengeCountdownOverlay || !countdownNum) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    isCountdownActive = true;
    challengeCountdownOverlay.style.display = 'flex';

    // 挑战倒计时全面净化：卡片内彻底隐藏 Emoji、释义胶囊、教材标签与字母气泡，杜绝提前发音
    if (wordEmoji) wordEmoji.style.display = 'none';
    if (chinesePill) chinesePill.style.display = 'none';
    if (puBadge) puBadge.style.display = 'none';
    if (bubblesContainer) bubblesContainer.style.display = 'none';
    if (readyEnterCard) readyEnterCard.style.display = 'none';
    if (wordSpeechTimer) {
      clearTimeout(wordSpeechTimer);
      wordSpeechTimer = null;
    }
    if (window.speechEngine) {
      window.speechEngine.cancel();
    }

    // Step 1: "3"
    countdownNum.textContent = '3';
    countdownNum.className = 'countdown-num-art';
    if (countdownTip) countdownTip.textContent = '双手放好 · 准备冲刺！';
    if (window.soundFX && window.soundFX.playCountdownPip) {
      window.soundFX.playCountdownPip(3);
    }

    // Step 2: "2" (1.0s)
    countdownTimerId = setTimeout(() => {
      countdownNum.textContent = '2';
      countdownNum.className = 'countdown-num-art';
      if (countdownTip) countdownTip.textContent = '锁定键盘 · 瞄准字母！';
      if (window.soundFX && window.soundFX.playCountdownPip) {
        window.soundFX.playCountdownPip(2);
      }

      // Step 3: "1" (2.0s)
      countdownTimerId = setTimeout(() => {
        countdownNum.textContent = '1';
        countdownNum.className = 'countdown-num-art';
        if (countdownTip) countdownTip.textContent = '深呼吸 · 马上开跑！';
        if (window.soundFX && window.soundFX.playCountdownPip) {
          window.soundFX.playCountdownPip(1);
        }

        // Step 4: "🚀 GO!" (3.0s)
        countdownTimerId = setTimeout(() => {
          countdownNum.textContent = '🚀 GO!';
          countdownNum.className = 'countdown-num-art num-go';
          if (countdownTip) countdownTip.textContent = '冲啊小勇士！';
          if (window.soundFX && window.soundFX.playCountdownPip) {
            window.soundFX.playCountdownPip('GO');
          }

          // Step 5: 正式启动挑战走秒与破晓协同亮相 (3.6s)
          countdownTimerId = setTimeout(() => {
            challengeCountdownOverlay.style.display = 'none';
            isCountdownActive = false;
            countdownTimerId = null;

            const wordObj = window.typoGame ? window.typoGame.getCurrentWordObj() : null;
            if (wordObj) {
              revealWordElementsWithPopIn(wordObj);
            }
            if (typeof onComplete === 'function') onComplete();
          }, 600);

        }, 1000);
      }, 1000);
    }, 1000);
  }

  // 离开确认弹窗按钮绑定
  if (btnExitResume) {
    btnExitResume.addEventListener('click', () => {
      if (exitConfirmModal) exitConfirmModal.style.display = 'none';
      if (window.typoGame) window.typoGame.resumeChallengeTimer();
      pendingSwitchMode = null;
    });
  }

  if (btnExitLeave) {
    btnExitLeave.addEventListener('click', () => {
      if (exitConfirmModal) exitConfirmModal.style.display = 'none';
      const target = pendingSwitchMode || 'practice';
      pendingSwitchMode = null;
      switchTab(target, false, true); // force switch
    });
  }

  function getScopeIcon(book) {
    if (!book || book === 'all') return '🌟';
    if (book.startsWith('苏教') || book === 'SJ_ALL') return '🏫';
    if (book === 'KET' || book === 'KET_ALL') return '🎓';
    return '📘';
  }

  // ================= 剑桥少儿英语 PU / 苏教版 / 剑桥 KET 教材单元点播系统 (Curriculum Selector) =================
  function setupCurriculumSelector() {
    if (!curriculumPicker || !btnCurriculumTrigger || !curriculumDropdown) return;

    const catalog = window.typoGame.getCurriculumCatalog();
    const currTabNav = document.getElementById('currTabNav');
    const btnCurriculumHero = document.getElementById('btnCurriculumHero');

    const tabHeroConfigs = {
      all: {
        text: '🌟 全教材综合大乱斗 (共 925 词)',
        book: 'all',
        unit: 'all'
      },
      SJ: {
        text: '🏫 苏教版三年级全套通练 (共 115 词)',
        book: 'SJ_ALL',
        unit: 'all'
      },
      PU: {
        text: '📘 剑桥 Power Up 全套通练 (共 212 词)',
        book: 'PU_ALL',
        unit: 'all'
      },
      KET: {
        text: '🎓 剑桥 KET 考级核心全库通练 (共 598 词)',
        book: 'KET_ALL',
        unit: 'all'
      }
    };

    // 动态渲染分册与单元卡片
    if (currBooksContainer) {
      currBooksContainer.innerHTML = '';

      const groups = catalog.groups || [
        { id: 'SJ', title: '🏫 苏教版小学英语 (译林版·三年级)', badge: '苏教版三年级', bookCodes: ['苏教3A', '苏教3B'] },
        { id: 'PU', title: '📘 剑桥少儿英语 Power Up', badge: '剑桥少儿核心', bookCodes: ['PU1', 'PU2', 'PU3'] },
        { id: 'KET', title: '🎓 剑桥 KET 考级核心词库 (A2 Key)', badge: '考级冲刺 · 598词', bookCodes: ['KET'] }
      ];

      groups.forEach(grp => {
        // 群组横幅
        const tagText = grp.tag || grp.badge || (grp.id === 'SJ' ? '校内同步 · 115词' : (grp.id === 'KET' ? '考级冲刺 · 598词' : '经典核心 · 212词'));
        const banner = document.createElement('div');
        banner.className = `curr-group-banner group-${grp.id.toLowerCase()}`;
        banner.dataset.curriculumGroup = grp.id;
        banner.innerHTML = `
          <span class="group-banner-title">${grp.title}</span>
          <span class="group-banner-tag">${tagText}</span>
        `;
        currBooksContainer.appendChild(banner);

        grp.bookCodes.forEach(code => {
          const bookData = catalog.books[code];
          if (!bookData) return;

          const section = document.createElement('div');
          section.className = 'curr-book-section';
          section.dataset.curriculumGroup = grp.id;

          // 头部：分册标题 + 全册/全库按钮
          const header = document.createElement('div');
          header.className = 'curr-book-header';

          const titleRow = document.createElement('div');
          titleRow.className = 'curr-book-title-row';

          const isKET = code === 'KET';
          const pillStyle = isKET ? 'style="background: rgba(245, 158, 11, 0.2); color: #FBBF24; border-color: rgba(245, 158, 11, 0.4);"' : '';

          titleRow.innerHTML = `
            <span class="curr-book-pill" ${pillStyle}>${code}</span>
            <span class="curr-book-name">${bookData.title}</span>
          `;

          const btnAll = document.createElement('button');
          btnAll.className = 'btn-book-all';
          btnAll.textContent = isKET ? `全库 (${bookData.count}词)` : `全册 (${bookData.count}词)`;
          btnAll.dataset.book = isKET ? 'KET_ALL' : code;
          btnAll.dataset.unit = 'all';

          header.appendChild(titleRow);
          header.appendChild(btnAll);
          section.appendChild(header);

          // 单元网格
          const grid = document.createElement('div');
          grid.className = 'curr-units-grid';

          const unitKeys = Object.keys(bookData.units).sort((a, b) => Number(a) - Number(b));
          unitKeys.forEach(uKey => {
            const uData = bookData.units[uKey];
            const card = document.createElement('button');
            card.className = 'curr-unit-card';
            card.dataset.book = code;
            card.dataset.unit = uData.unit;
            card.innerHTML = `
              <span class="unit-card-tag">${code} · U${uData.unit}</span>
              <span class="unit-card-name">${uData.name || `Unit ${uData.unit}`}</span>
              <span class="unit-card-count">${uData.count} 词</span>
            `;
            grid.appendChild(card);
          });

          section.appendChild(grid);
          currBooksContainer.appendChild(section);
        });
      });
    }

    // 教材标签导航切换函数
    function switchCurriculumTab(tabId) {
      if (currTabNav) {
        currTabNav.querySelectorAll('.curr-tab-btn').forEach(btn => {
          if (btn.dataset.curriculumTab === tabId) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      // 更新 Hero 按钮文本与数据属性
      if (btnCurriculumHero && tabHeroConfigs[tabId]) {
        const cfg = tabHeroConfigs[tabId];
        btnCurriculumHero.textContent = cfg.text;
        btnCurriculumHero.dataset.book = cfg.book;
        btnCurriculumHero.dataset.unit = cfg.unit;

        // 同步 active 状态
        const cur = window.typoGame.getFilterInfo();
        if (String(cur.book) === String(cfg.book) && String(cur.unit) === String(cfg.unit)) {
          btnCurriculumHero.classList.add('active');
        } else {
          btnCurriculumHero.classList.remove('active');
        }
      }

      // 联动过滤下方教材分册和单元卡片展示
      if (currBooksContainer) {
        Array.from(currBooksContainer.children).forEach(el => {
          const grp = el.dataset.curriculumGroup;
          if (tabId === 'all' || grp === tabId) {
            el.style.display = '';
          } else {
            el.style.display = 'none';
          }
        });
      }

      // 重置滚动条位置，彻底消除切换时的滚动突跳
      curriculumDropdown.scrollTop = 0;
    }

    if (currTabNav) {
      currTabNav.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.curr-tab-btn');
        if (!tabBtn) return;
        e.stopPropagation();
        const tabId = tabBtn.dataset.curriculumTab;
        
        // 允许“取消选择”：若再次点击当前已激活的分类，则平滑撤销筛选回到全部
        const activeBtn = currTabNav.querySelector('.curr-tab-btn.active');
        const currentActive = activeBtn ? activeBtn.dataset.curriculumTab : 'all';
        if (tabId === currentActive && tabId !== 'all') {
          switchCurriculumTab('all');
        } else {
          switchCurriculumTab(tabId);
        }
        window.soundFX?.playKeyPop?.(1);
      });
    }

    // 统一切换处理
    function applyCurriculumFilter(book, unit) {
      if (window.typoGame && window.typoGame.mode === 'practice') {
        isAwaitingStart = true;
      }
      const info = window.typoGame.setWordFilter(book, unit);
      const sIcon = getScopeIcon(info.book);

      // 更新触发按钮与状态
      if (currSelectedLabel) {
        currSelectedLabel.textContent = `${info.shortTitle} · ${info.count}词`;
      }
      if (currUnitCountBadge) {
        currUnitCountBadge.textContent = `共 ${info.count} 词`;
      }
      if (challengeScopeBadge) {
        challengeScopeBadge.textContent = `${sIcon} ${info.shortTitle}`;
      }

      // 更新下拉项的高亮 active 类
      const allOptButtons = curriculumDropdown.querySelectorAll('[data-book][data-unit]');
      allOptButtons.forEach(btn => {
        const b = btn.dataset.book;
        const u = btn.dataset.unit;
        const isMatch = (b === String(book)) && (String(u) === String(unit));
        if (isMatch) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // 播放提示音与提示气泡
      window.soundFX.playKeyPop(3);
      showModeToast(sIcon, `已切换至：${info.title} (${info.count}词)`);

      // 关闭下拉框
      closeCurriculumDropdown();
    }

    function toggleCurriculumDropdown() {
      const isOpen = curriculumDropdown.style.display !== 'none';
      if (isOpen) {
        closeCurriculumDropdown();
      } else {
        openCurriculumDropdown();
      }
    }

    function openCurriculumDropdown() {
      // 先计算并执行 Tab 预同步，避免显示后再重排引起抖动
      const curFilter = window.typoGame.getFilterInfo();
      let targetTab = 'all';
      if (curFilter.book === 'SJ_ALL' || curFilter.book.startsWith('苏教')) {
        targetTab = 'SJ';
      } else if (curFilter.book === 'PU_ALL' || curFilter.book.startsWith('PU')) {
        targetTab = 'PU';
      } else if (curFilter.book === 'KET_ALL' || curFilter.book.startsWith('KET')) {
        targetTab = 'KET';
      }

      const activeTabBtn = currTabNav ? currTabNav.querySelector('.curr-tab-btn.active') : null;
      const currentNavTab = activeTabBtn ? activeTabBtn.dataset.curriculumTab : 'all';
      if (targetTab !== 'all' && currentNavTab === 'all') {
        switchCurriculumTab(targetTab);
      } else {
        switchCurriculumTab(currentNavTab);
      }

      curriculumDropdown.style.display = 'flex';
      curriculumPicker.classList.add('open');
    }

    function closeCurriculumDropdown() {
      curriculumDropdown.style.display = 'none';
      curriculumPicker.classList.remove('open');
    }

    btnCurriculumTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCurriculumDropdown();
    });

    // 委托点击事件处理下拉面板内所有选项
    curriculumDropdown.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('[data-book][data-unit]');
      if (!targetBtn) return;
      e.stopPropagation();
      const b = targetBtn.dataset.book;
      const u = targetBtn.dataset.unit;
      applyCurriculumFilter(b, u);
    });

    // 点击页面其他任意区域关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!curriculumPicker.contains(e.target)) {
        closeCurriculumDropdown();
      }
    });

    // 点击单词卡片左上角教材徽章时也可快速展开选择器
    if (puBadge) {
      puBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentActiveTab === 'practice') {
          openCurriculumDropdown();
        }
      });
    }

    // 初始化时根据 localStorage 恢复的词库状态渲染界面
    const initInfo = window.typoGame.getFilterInfo();
    const initIcon = getScopeIcon(initInfo.book);
    if (currSelectedLabel) currSelectedLabel.textContent = `${initInfo.shortTitle} · ${initInfo.count}词`;
    if (currUnitCountBadge) currUnitCountBadge.textContent = `共 ${initInfo.count} 词`;
    if (challengeScopeBadge) challengeScopeBadge.textContent = `${initIcon} ${initInfo.shortTitle}`;

    // 同步高亮下拉面板内选中的卡片/全套按钮
    const allOptButtons = curriculumDropdown.querySelectorAll('[data-book][data-unit]');
    allOptButtons.forEach(btn => {
      const b = btn.dataset.book;
      const u = btn.dataset.unit;
      const isMatch = (b === String(initInfo.book)) && (String(u) === String(initInfo.unit));
      if (isMatch) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 确定对应的分类 Tab 并激活对应 Tab 视图与 Hero 按钮
    let initTab = 'all';
    if (initInfo.book === 'SJ_ALL' || initInfo.book.startsWith('苏教')) {
      initTab = 'SJ';
    } else if (initInfo.book === 'PU_ALL' || initInfo.book.startsWith('PU')) {
      initTab = 'PU';
    } else if (initInfo.book === 'KET_ALL' || initInfo.book.startsWith('KET')) {
      initTab = 'KET';
    }
    switchCurriculumTab(initTab);
  }

  // ================= 1. 界面标签页切换（中途保护、重置与倒计时起跑） =================
  function switchTab(mode, isInitial = false, force = false) {
    // 0. 中途退出极速挑战防护：如果正在激战中且非强制，给出拦截确认
    if (!force && !isInitial && currentActiveTab === 'challenge' && mode !== 'challenge') {
      if (window.typoGame && window.typoGame.isInActiveChallenge()) {
        // 立即冻结挑战倒计时（绝不让用户在读提示时扣心）
        window.typoGame.pauseChallengeTimer();

        // 弹窗提示
        if (exitConfirmModal) {
          if (exitCurrentScore) exitCurrentScore.textContent = window.typoGame.score || 0;
          if (exitCurrentLives) exitCurrentLives.textContent = `${window.typoGame.lives} / ${window.typoGame.maxLives}`;
          pendingSwitchMode = mode;
          exitConfirmModal.style.display = 'flex';
        }
        return;
      }
    }

    // 取消任何正在进行的倒计时
    cancelChallengeCountdown();

    // 播放 Tab 切换清脆音效
    if (!isInitial) {
      window.soundFX.playTabSwitch();
    }

    // 1. 先关闭任何已弹出的结算与确认弹窗
    if (reportModal) reportModal.style.display = 'none';
    if (exitConfirmModal) exitConfirmModal.style.display = 'none';
    if (challengeStartModal) challengeStartModal.style.display = 'none';
    if (curriculumDropdown) curriculumDropdown.style.display = 'none';
    if (curriculumPicker) curriculumPicker.classList.remove('open');

    // 2. 清除键盘所有高亮与按压状态
    document.querySelectorAll('.apple-key.highlight-target').forEach(el => el.classList.remove('highlight-target'));
    document.querySelectorAll('.apple-key.pressed').forEach(el => el.classList.remove('pressed'));

    // 3. 彻底重置游戏引擎所有计时器、发音与数据并释放所有按钮焦点
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    window.typoGame.resetAll();

    currentActiveTab = mode;
    [tabPractice, tabChallenge, tabTutorial].forEach(t => t.classList.remove('active'));

    if (mode === 'practice') {
      tabPractice.classList.add('active');
      wordArena.style.display = 'flex';
      tutorialArena.style.display = 'none';
      if (challengeHudContent) challengeHudContent.style.display = 'none';
      if (practiceHudContent) practiceHudContent.style.display = 'flex';
      if (tutorialHudContent) tutorialHudContent.style.display = 'none';
      if (consoleTimerTrack) consoleTimerTrack.style.display = 'none';
      if (speedBadge) speedBadge.style.display = 'flex';
      if (tutorialDeckPill) tutorialDeckPill.style.display = 'none';
      isAwaitingStart = true;
      window.typoGame.startPracticeMode();
    } else if (mode === 'challenge') {
      tabChallenge.classList.add('active');
      wordArena.style.display = 'flex';
      tutorialArena.style.display = 'none';
      if (challengeHudContent) challengeHudContent.style.display = 'flex';
      if (practiceHudContent) practiceHudContent.style.display = 'none';
      if (tutorialHudContent) tutorialHudContent.style.display = 'none';
      if (consoleTimerTrack) consoleTimerTrack.style.display = 'block';
      if (speedBadge) speedBadge.style.display = 'flex';
      if (tutorialDeckPill) tutorialDeckPill.style.display = 'none';
      // 启动挑战：装载单词与界面，但先不走秒
      window.typoGame.startChallengeMode(false);
      if (challengeProgressText) {
        challengeProgressText.textContent = `0 / ${window.typoGame.maxChallengeWords} 词`;
      }
      if (challengeScopeBadge) {
        const fInfo = window.typoGame.getFilterInfo();
        const fIcon = getScopeIcon(fInfo.book);
        challengeScopeBadge.textContent = `${fIcon} ${fInfo.shortTitle}`;
      }
      if (challengeDiffBadge) {
        const diffPreset = window.typoGame.getDifficultyPreset();
        challengeDiffBadge.textContent = diffPreset.hudTag;
      }
      // 启动 3, 2, 1 动感倒计时，结束后再正式开始计时
      startChallengeCountdown(() => {
        window.typoGame.startChallengeTimer();
      });
    } else if (mode === 'tutorial') {
      tabTutorial.classList.add('active');
      wordArena.style.display = 'none';
      tutorialArena.style.display = 'flex';
      if (challengeHudContent) challengeHudContent.style.display = 'none';
      if (practiceHudContent) practiceHudContent.style.display = 'none';
      if (tutorialHudContent) tutorialHudContent.style.display = 'flex';
      if (consoleTimerTrack) consoleTimerTrack.style.display = 'none';
      if (speedBadge) speedBadge.style.display = 'none';
      if (tutorialDeckPill) tutorialDeckPill.style.display = 'inline-flex';
      switchGuideSubTab(window.keyboardGuide.activeGuideTab || 'posture');
    }
    autoFitViewport();
  }

  // 极速挑战三阶难度控制体系
  function updateDifficultyUI(diffKey) {
    const preset = window.typoGame.setDifficulty(diffKey);
    if (diffSelectorDeck) {
      diffSelectorDeck.querySelectorAll('.diff-hero-card').forEach(btn => {
        if (btn.dataset.diff === diffKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
    if (stripTimerVal) {
      stripTimerVal.textContent = `${preset.baseSeconds}s → ${preset.minSeconds}s`;
    }
    if (stripLivesVal) {
      if (preset.lives === 1) {
        stripLivesVal.innerHTML = `<span style="color: #FB7185;">1 条心 (一命到底)</span>`;
      } else {
        stripLivesVal.textContent = `${preset.lives} 条小心心`;
      }
    }
    if (challengeDiffBadge) {
      challengeDiffBadge.textContent = preset.hudTag;
    }
  }

  if (diffSelectorDeck) {
    diffSelectorDeck.addEventListener('click', (e) => {
      const btn = e.target.closest('.diff-hero-card');
      if (!btn) return;
      const d = btn.dataset.diff;
      if (d) {
        updateDifficultyUI(d);
        if (window.soundFX && window.soundFX.playKeyPop) {
          window.soundFX.playKeyPop(2);
        }
      }
    });
  }

  tabPractice.addEventListener('click', () => switchTab('practice'));
  tabChallenge.addEventListener('click', () => {
    if (currentActiveTab === 'challenge') return;
    if (challengeStartModal) {
      const info = window.typoGame.getFilterInfo();
      const sIcon = getScopeIcon(info.book);
      const maxWords = Math.min(30, info.count);
      if (startModalTitle) {
        startModalTitle.innerHTML = `<span class="title-flash-icon">⚡</span> 极速挑战 · ${maxWords}词大满贯`;
      }
      if (startModalBadge) {
        startModalBadge.textContent = `🎯 连冲 ${maxWords} 词`;
      }
      if (startModalScopeChip) {
        startModalScopeChip.textContent = `${sIcon} ${info.title} (${info.count}词)`;
      }

      // 同步当前选中的难度及数据条
      updateDifficultyUI(window.typoGame.difficulty);

      challengeStartModal.style.display = 'flex';
    } else {
      switchTab('challenge');
    }
  });
  tabTutorial.addEventListener('click', () => switchTab('tutorial'));

  if (btnChallengeConfirm) {
    btnChallengeConfirm.addEventListener('click', () => {
      if (challengeStartModal) challengeStartModal.style.display = 'none';
      switchTab('challenge');
    });
  }

  if (btnChallengeCancel) {
    btnChallengeCancel.addEventListener('click', () => {
      if (challengeStartModal) challengeStartModal.style.display = 'none';
    });
  }

  // ================= 2. 单词与字母气泡渲染与首词回车起跑 =================
  const readyEnterCard = document.getElementById('readyEnterCard');
  const btnReadyEnterGo = document.getElementById('btnReadyEnterGo');
  let isAwaitingStart = false;
  let wordSpeechTimer = null;

  // 单词卡片各要素破晓协同弹入与发音
  function revealWordElementsWithPopIn(wordObj) {
    if (readyEnterCard) readyEnterCard.style.display = 'none';
    if (challengeCountdownOverlay) challengeCountdownOverlay.style.display = 'none';

    document.querySelectorAll('.apple-key.ready-target-enter').forEach(el => el.classList.remove('ready-target-enter'));

    if (puBadge) {
      if (wordObj && wordObj.book) {
        const isSJ = wordObj.book.startsWith('苏教');
        puBadge.style.display = 'inline-flex';
        puBadge.textContent = `${isSJ ? '🏫' : '📘'} ${wordObj.book} · U${wordObj.unit || 1} ${wordObj.categoryCn || ''}`;
        puBadge.classList.remove('pop-in');
        void puBadge.offsetWidth;
        puBadge.classList.add('pop-in');
      } else {
        puBadge.style.display = 'none';
      }
    }

    if (wordEmoji) {
      wordEmoji.style.display = 'inline-block';
      wordEmoji.textContent = wordObj ? wordObj.emoji : '';
      wordEmoji.classList.remove('pop-in', 'emoji-celebrate');
      void wordEmoji.offsetWidth;
      wordEmoji.classList.add('pop-in');
    }

    if (chinesePill) {
      chinesePill.style.display = 'flex';
      if (chineseText) chineseText.textContent = wordObj ? wordObj.chinese : '';
      chinesePill.classList.remove('pop-in');
      void chinesePill.offsetWidth;
      chinesePill.classList.add('pop-in');
    }

    if (bubblesContainer) {
      bubblesContainer.style.display = 'flex';
    }

    // 重新构建字母气泡并触发 80ms 纯英文发音
    renderWord(wordObj, 0);
  }

  // 展示首词「敲 Enter 开始 / Let's Go!」准备卡片并指引右手小指回车
  function showReadyEnterPrompt() {
    isAwaitingStart = true;
    if (wordSpeechTimer) {
      clearTimeout(wordSpeechTimer);
      wordSpeechTimer = null;
    }
    if (window.speechEngine) {
      window.speechEngine.cancel();
    }

    // 单词探索就绪舱全面净化：隐藏所有无关散碎元素
    if (wordEmoji) wordEmoji.style.display = 'none';
    if (chinesePill) chinesePill.style.display = 'none';
    if (puBadge) puBadge.style.display = 'none';
    if (bubblesContainer) {
      bubblesContainer.style.display = 'none';
      bubblesContainer.innerHTML = '';
    }

    if (readyEnterCard) {
      readyEnterCard.style.display = 'flex';
      readyEnterCard.classList.remove('lets-go-burst');
    }

    // 虚拟键盘高亮 Enter 键并启动呼吸脉冲
    highlightTargetKeyboardKey('Enter');
    const enterKeyEl = document.querySelector('.apple-key[data-key="Enter"]');
    if (enterKeyEl) {
      enterKeyEl.classList.add('ready-target-enter');
    }

    // 手指栏提示右手小拇指敲击回车
    updateFingerPrompt('enter');
  }

  // 敲击 Enter 键或点击卡片激活首词冒险
  function startTypingSession(directKey = null) {
    if (!isAwaitingStart) return;
    isAwaitingStart = false;

    if (readyEnterCard) {
      readyEnterCard.classList.add('lets-go-burst');
    }

    // 播放轻快欢腾的起跑和弦
    if (window.soundFX && window.soundFX.playSimpleIntro) {
      window.soundFX.playSimpleIntro();
    }

    setTimeout(() => {
      const wordObj = window.typoGame ? window.typoGame.getCurrentWordObj() : null;
      if (wordObj) {
        revealWordElementsWithPopIn(wordObj);
      }

      // 如果是通过敲中首字母穿透触发的，顺畅执行首字母按键！
      if (directKey) {
        setTimeout(() => {
          if (window.typoGame) {
            window.typoGame.handleKeyInput(directKey);
          }
        }, 80);
      }
    }, 220);
  }

  // 点击准备卡片或 Let's Go 按钮随时起跑
  if (readyEnterCard) {
    readyEnterCard.addEventListener('click', (e) => {
      e.stopPropagation();
      startTypingSession();
    });
  }
  if (btnReadyEnterGo) {
    btnReadyEnterGo.addEventListener('click', (e) => {
      e.stopPropagation();
      startTypingSession();
    });
  }

  function renderWord(wordObj, currentHitIdx) {
    if (wordSpeechTimer) {
      clearTimeout(wordSpeechTimer);
      wordSpeechTimer = null;
    }
    if (window.speechEngine) {
      window.speechEngine.cancel();
    }

    if (wordEmoji) {
      wordEmoji.classList.remove('emoji-celebrate');
    }

    // 若当前处于等待回车启动状态（单词探索模式首词）
    if (isAwaitingStart && window.typoGame && window.typoGame.mode === 'practice') {
      showReadyEnterPrompt();
      return;
    }

    // 若当前处于极速挑战 3-2-1 倒计时状态
    if (isCountdownActive && window.typoGame && window.typoGame.mode === 'challenge') {
      if (wordEmoji) wordEmoji.style.display = 'none';
      if (chinesePill) chinesePill.style.display = 'none';
      if (puBadge) puBadge.style.display = 'none';
      if (bubblesContainer) bubblesContainer.style.display = 'none';
      return;
    }

    if (readyEnterCard) {
      readyEnterCard.style.display = 'none';
    }
    if (challengeCountdownOverlay) {
      challengeCountdownOverlay.style.display = 'none';
    }
    document.querySelectorAll('.apple-key.ready-target-enter').forEach(el => el.classList.remove('ready-target-enter'));

    if (puBadge) {
      if (wordObj && wordObj.book) {
        const isSJ = wordObj.book.startsWith('苏教');
        puBadge.style.display = 'inline-flex';
        puBadge.textContent = `${isSJ ? '🏫' : '📘'} ${wordObj.book} · U${wordObj.unit || 1} ${wordObj.categoryCn || ''}`;
      } else {
        puBadge.style.display = 'none';
      }
    }

    if (wordEmoji) {
      wordEmoji.style.display = 'inline-block';
      wordEmoji.textContent = wordObj ? wordObj.emoji : '';
    }

    if (chinesePill) {
      chinesePill.style.display = 'flex';
      chineseText.textContent = wordObj ? wordObj.chinese : '';
    }

    if (bubblesContainer) {
      bubblesContainer.style.display = 'flex';
      bubblesContainer.innerHTML = '';
    }
    const word = (wordObj && wordObj.word) ? wordObj.word : '';
    const len = word.length;

    // 根据单词字符长度动态适配气泡缩微梯级，确保特别长的单词也能尽量在单行完整呈现
    bubblesContainer.className = 'word-bubbles-container';
    if (len >= 11) {
      bubblesContainer.classList.add('len-xlong');
    } else if (len >= 9) {
      bubblesContainer.classList.add('len-long');
    } else if (len === 8) {
      bubblesContainer.classList.add('len-compact');
    } else if (len === 7) {
      bubblesContainer.classList.add('len-medium');
    }

    for (let i = 0; i < word.length; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'letter-bubble pop-in';
      bubble.id = `bubble-${i}`;
      bubble.textContent = word[i];

      if (i < currentHitIdx) {
        bubble.classList.add('hit');
      } else if (i === currentHitIdx) {
        bubble.classList.add('active');
      }
      bubblesContainer.appendChild(bubble);
    }

    updateFingerPrompt(word[currentHitIdx]);
    highlightTargetKeyboardKey(word[currentHitIdx]);

    // 新词登场核心音画同步：微延时 80ms 伴随气泡 pop-in 弹性展开，立即朗读新词纯英文原声发音
    if (word) {
      const wordToSpeak = word;
      wordSpeechTimer = setTimeout(() => {
        if (window.speechEngine) {
          window.speechEngine.speakEnglish(wordToSpeak, null, 1.15);
        }
      }, 80);
    }
  }

  // 更新手指推荐与键盘高亮（生动矢量手掌图解 + 消除歧义）
  function updateFingerPrompt(char) {
    if (!char) {
      fingerBadge.innerHTML = '<span class="finger-finish-tag">🎉 单词完成！</span>';
      fingerBadge.style.backgroundColor = '#10B981';
      return;
    }
    const info = window.keyboardGuide.getFingerForChar(char);
    const handSvg = window.keyboardGuide.getMiniHandSvg(info.finger);
    fingerBadge.innerHTML = `<span class="finger-hand-tag">${handSvg} ${info.hand}</span><span class="finger-name-tag">${info.fingerName}</span>`;
    fingerBadge.style.backgroundColor = info.color;
  }

  function highlightTargetKeyboardKey(char) {
    // 移除之前的高亮
    document.querySelectorAll('.apple-key.highlight-target').forEach(el => el.classList.remove('highlight-target'));
    if (!char) return;

    let selector = `.apple-key[data-key="${char.toLowerCase()}"]`;
    if (char === ' ') selector = '.apple-key[data-key=" "]';
    if (char.toLowerCase() === 'enter') selector = '.apple-key[data-key="Enter"]';
    if (char.toLowerCase() === 'backspace' || char.toLowerCase() === 'delete') selector = '.apple-key[data-key="Backspace"]';

    const keyEl = document.querySelector(selector);
    if (keyEl) {
      keyEl.classList.add('highlight-target');
    }
  }

  // 中文释义点击：播放中文释义发音
  if (chinesePill) {
    chinesePill.title = '点击朗读中文释义';
    chinesePill.addEventListener('click', () => {
      const wordObj = window.typoGame.getCurrentWordObj();
      if (wordObj && wordObj.chinese) {
        if (wordSpeechTimer) {
          clearTimeout(wordSpeechTimer);
          wordSpeechTimer = null;
        }
        window.speechEngine.speakChinese(wordObj.chinese);
        if (window.soundFX && window.soundFX.playKeyPop) {
          window.soundFX.playKeyPop(3);
        }
      }
    });
  }

  // 单词大 Emoji 点击：随时重听英文原声发音
  if (wordEmoji) {
    wordEmoji.style.cursor = 'pointer';
    wordEmoji.title = '点击重听英文发音';
    wordEmoji.addEventListener('click', () => {
      const wordObj = window.typoGame.getCurrentWordObj();
      if (wordObj && wordObj.word) {
        if (wordSpeechTimer) {
          clearTimeout(wordSpeechTimer);
          wordSpeechTimer = null;
        }
        window.speechEngine.speakEnglish(wordObj.word, null, 1.15);
        if (window.soundFX && window.soundFX.playKeyPop) {
          window.soundFX.playKeyPop(2);
        }
      }
    });
  }

  // ================= 2.5 单词字母爆炸与炫彩礼花粒子系统 =================
  let explosionCanvas = null;
  let explosionCtx = null;
  let activeExplosionParticles = [];
  let explosionAnimId = null;

  function initExplosionCanvas() {
    if (explosionCanvas) return;
    explosionCanvas = document.createElement('canvas');
    explosionCanvas.className = 'word-explosion-canvas';
    explosionCanvas.id = 'wordExplosionCanvas';
    document.body.appendChild(explosionCanvas);
    explosionCtx = explosionCanvas.getContext('2d');

    const resize = () => {
      if (explosionCanvas) {
        explosionCanvas.width = window.innerWidth;
        explosionCanvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
  }

  // 绘制 4 边晶莹星光 (Diamond Star)
  function drawSparkleStar(ctx, x, y, r, rotation, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      ctx.lineTo(Math.cos(a + Math.PI / 4) * (r * 0.35), Math.sin(a + Math.PI / 4) * (r * 0.35));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 绘制翻转彩纸碎屑 (Confetti Ribbon)
  function drawConfettiRibbon(ctx, x, y, w, h, tilt, rotation, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, (-h / 2) * Math.cos(tilt), w, h * Math.cos(tilt));
    ctx.restore();
  }

  // 绘制发光圆球果冻粒子 (Glow Dot)
  function drawGlowDot(ctx, x, y, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function triggerWordExplosion() {
    initExplosionCanvas();
    if (!explosionCtx) return;

    // 播放专属 Q 弹破裂与魔法星光合成音效
    if (window.soundFX && window.soundFX.playWordExplosion) {
      window.soundFX.playWordExplosion();
    }

    const bubbles = bubblesContainer ? bubblesContainer.querySelectorAll('.letter-bubble') : [];
    if (!bubbles.length) return;

    const colors = ['#FBBF24', '#FB7185', '#38BDF8', '#34D399', '#A78BFA', '#F472B6', '#FFFFFF'];

    bubbles.forEach((b) => {
      // 触发 CSS 气泡破裂消散
      b.classList.add('exploding');

      const rect = b.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // 每个字母中心喷射 16 颗炫彩微粒
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.7;
        const speed = 4.5 + Math.random() * 8;
        const type = Math.random() < 0.45 ? 'star' : (Math.random() < 0.75 ? 'confetti' : 'dot');
        const color = colors[Math.floor(Math.random() * colors.length)];

        activeExplosionParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (1.8 + Math.random() * 2.2), // 初始轻微向上喷发
          gravity: 0.22,
          drag: 0.965,
          size: 5 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.25,
          tilt: Math.random() * Math.PI,
          vtilt: 0.08 + Math.random() * 0.12,
          alpha: 1.0,
          decay: 0.016 + Math.random() * 0.014, // 约 45~65 帧内平滑消散
          type,
          color
        });
      }
    });

    if (!explosionAnimId) {
      runExplosionLoop();
    }
  }

  function runExplosionLoop() {
    if (!explosionCtx || !explosionCanvas) return;

    explosionCtx.clearRect(0, 0, explosionCanvas.width, explosionCanvas.height);

    for (let i = activeExplosionParticles.length - 1; i >= 0; i--) {
      const p = activeExplosionParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.rotation += p.vr;
      p.tilt += p.vtilt;
      p.alpha -= p.decay;

      if (p.alpha <= 0.01) {
        activeExplosionParticles.splice(i, 1);
        continue;
      }

      if (p.type === 'star') {
        drawSparkleStar(explosionCtx, p.x, p.y, p.size * 1.5, p.rotation, p.color, p.alpha);
      } else if (p.type === 'confetti') {
        drawConfettiRibbon(explosionCtx, p.x, p.y, p.size * 1.4, p.size * 0.8, p.tilt, p.rotation, p.color, p.alpha);
      } else {
        drawGlowDot(explosionCtx, p.x, p.y, p.size * 0.8, p.color, p.alpha);
      }
    }

    if (activeExplosionParticles.length > 0) {
      explosionAnimId = requestAnimationFrame(runExplosionLoop);
    } else {
      explosionCtx.clearRect(0, 0, explosionCanvas.width, explosionCanvas.height);
      explosionAnimId = null;
    }
  }

  // ================= 3. 游戏引擎回调绑定 =================
  let lastTenseTickTime = 0;
  let tenseBeatIndex = 0;

  window.typoGame.onWordComplete = (wordObj) => {
    // 单词探索模式专属：敲完全部字母瞬间引爆炫彩星光礼花，同时大 Emoji 萌趣果冻欢跃弹跳
    if (window.typoGame && window.typoGame.mode === 'practice') {
      triggerWordExplosion();

      if (wordEmoji) {
        wordEmoji.classList.remove('emoji-celebrate');
        void wordEmoji.offsetWidth; // 触发 reflow 重启关键帧
        wordEmoji.classList.add('emoji-celebrate');
      }
    }
  };

  window.typoGame.onWordChange = (wordObj, charIdx) => {
    lastTenseTickTime = 0;
    tenseBeatIndex = 0;
    renderWord(wordObj, charIdx);
  };

  window.typoGame.onLetterHit = (hitIdx, char) => {
    const bubble = document.getElementById(`bubble-${hitIdx}`);
    if (bubble) {
      bubble.classList.remove('active');
      bubble.classList.add('hit');
      bubble.classList.add('squish');
      setTimeout(() => bubble.classList.remove('squish'), 250);
    }

    const nextIdx = hitIdx + 1;
    const nextBubble = document.getElementById(`bubble-${nextIdx}`);
    if (nextBubble) {
      nextBubble.classList.add('active');
    }

    const wordObj = window.typoGame.getCurrentWordObj();
    if (wordObj && nextIdx < wordObj.word.length) {
      updateFingerPrompt(wordObj.word[nextIdx]);
      highlightTargetKeyboardKey(wordObj.word[nextIdx]);
    } else {
      highlightTargetKeyboardKey(null);
    }
  };

  window.typoGame.onLetterMiss = (charIdx) => {
    const bubble = document.getElementById(`bubble-${charIdx}`);
    if (bubble) {
      bubble.classList.add('shake');
      setTimeout(() => bubble.classList.remove('shake'), 350);
    }
  };

  window.typoGame.onTimerTick = (timeLeft, maxTime) => {
    const pct = Math.max(0, (timeLeft / maxTime) * 100);
    timerFill.style.width = `${pct}%`;

    // 倒计时进入最后 2.4 秒进入紧迫加速倒数
    if (timeLeft <= 2.4) {
      timerFill.classList.add('danger');

      // 三阶动态紧迫感与加速节拍 (Accelerando)
      let intervalMs = 380;
      let urgencyLevel = 1;

      if (timeLeft <= 0.8) {
        intervalMs = 150; // 阶梯 3 (<0.8s): 极速绝杀高潮，急促蜂鸣冲刺！
        urgencyLevel = 3;
        timerFill.classList.add('critical');
      } else if (timeLeft <= 1.5) {
        intervalMs = 240; // 阶梯 2 (0.8s~1.5s): 步步紧逼，明显加快！
        urgencyLevel = 2;
        timerFill.classList.remove('critical');
      } else {
        timerFill.classList.remove('critical');
      }

      const now = performance.now();
      if (now - lastTenseTickTime >= intervalMs) {
        lastTenseTickTime = now;
        tenseBeatIndex++;
        const isTick = (tenseBeatIndex % 2 === 1);
        window.soundFX.playTenseTick(urgencyLevel, isTick);
      }
    } else {
      timerFill.classList.remove('danger');
      timerFill.classList.remove('critical');
      lastTenseTickTime = 0;
      tenseBeatIndex = 0;
    }
  };

  window.typoGame.onScoreChange = (score) => {
    scoreVal.textContent = score;
  };

  window.typoGame.onComboChange = (combo) => {
    if (!comboBadge) return;
    if (combo >= 2) {
      comboBadge.style.display = 'inline-flex';
      if (combo >= 12) {
        comboBadge.textContent = `👑 ${combo} Combo! 狂热超神`;
      } else if (combo >= 8) {
        comboBadge.textContent = `🚀 ${combo} Combo! 势不可挡`;
      } else if (combo >= 5) {
        comboBadge.textContent = `⚡ ${combo} Combo! 极速疾风`;
      } else if (combo >= 3) {
        comboBadge.textContent = `🔥 ${combo} Combo! 渐入佳境`;
      } else {
        comboBadge.textContent = `🔥 ${combo} Combo!`;
      }
      comboBadge.classList.remove('combo-pop');
      void comboBadge.offsetWidth;
      comboBadge.classList.add('combo-pop');
    } else {
      comboBadge.style.display = 'none';
    }
  };

  window.typoGame.onLivesChange = (lives, maxLives) => {
    if (!livesBox) return;
    const total = maxLives || window.typoGame.maxLives || 3;
    livesBox.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const h = document.createElement('span');
      h.className = 'heart-icon' + (i >= lives ? ' lost' : '');
      h.textContent = i < lives ? '💖' : '💔';
      livesBox.appendChild(h);
    }
  };

  // 极速挑战 30 词冲刺赛实时进度更新
  window.typoGame.onProgressUpdate = (current, total) => {
    if (challengeProgressText) {
      challengeProgressText.textContent = `${current} / ${total} 词`;
    }
  };

  window.typoGame.onGameOver = (report) => {
    if (reportModalTitle) {
      if (report.isVictory) {
        const medal = report.difficultyPreset ? report.difficultyPreset.medal : '🏆 黄金大满贯';
        reportModalTitle.textContent = `🎉 通关！荣获 ${medal}`;
      } else {
        reportModalTitle.textContent = '挑战大捷！';
      }
    }
    if (reportModalTrophy) {
      reportModalTrophy.textContent = report.isVictory ? '🎉' : '🏆';
    }
    resScore.textContent = report.score;
    resWords.textContent = report.isVictory ? `${report.wordsCount} / ${report.maxWords || 30} 词` : report.wordsCount;
    resCombo.textContent = report.maxCombo;
    resFastest.textContent = report.fastestTime > 0 ? `${report.fastestTime}s (${report.fastestWord})` : '-';
    if (resSpeed) {
      const tierIcon = report.tier ? report.tier.icon : '🐢';
      resSpeed.textContent = `${tierIcon} ${report.wpm} WPM`;
    }

    if (report.isVictory) {
      window.soundFX.playFanfare();
    }

    if (report.wrongWords && report.wrongWords.length > 0) {
      wrongWordsBox.style.display = 'flex';
      wrongTags.innerHTML = report.wrongWords.map(w => `<span class="wrong-tag">${w.emoji} ${w.word} (${w.chinese})</span>`).join('');
    } else {
      wrongWordsBox.style.display = 'none';
    }

    // 稳定存储至 LocalStorage 并更新排行榜名次
    if (window.scoreStorage) {
      const saveRes = window.scoreStorage.saveScore(report);
      lastPlayedRecordId = saveRes.record ? saveRes.record.id : null;

      if (reportRankBadge) {
        reportRankBadge.style.display = 'inline-flex';
        if (saveRes.isNewBest) {
          if (reportRankIcon) reportRankIcon.textContent = '🏆';
          if (reportRankText) reportRankText.textContent = '🎉 刷新历史最高纪录！荣登第 1 名！';
        } else if (saveRes.rank <= 10) {
          if (reportRankIcon) reportRankIcon.textContent = '🎖️';
          if (reportRankText) reportRankText.textContent = `🌟 荣耀上榜！名列历史第 ${saveRes.rank} 名！`;
        } else {
          if (reportRankIcon) reportRankIcon.textContent = '💪';
          if (reportRankText) reportRankText.textContent = `本次得分已记录！当前位列第 ${saveRes.rank} 名`;
        }
      }
    }

    reportModal.style.display = 'flex';
  };

  // 监听打字手速与段位更新
  window.typoGame.onSpeedUpdate = (wpm, tierInfo, cpm) => {
    if (speedVal) speedVal.textContent = wpm;
    if (speedAnimalIcon) speedAnimalIcon.textContent = tierInfo.icon;
    if (speedTierLbl) {
      const detailStr = wpm > 0 ? `${tierInfo.tier} · ${cpm} 键/分` : `${tierInfo.tier} · 准备就绪`;
      speedTierLbl.textContent = detailStr;
      speedTierLbl.style.color = tierInfo.color || '#38BDF8';
    }
    if (speedBadge) {
      speedBadge.classList.remove('speed-bounce');
      void speedBadge.offsetWidth;
      speedBadge.classList.add('speed-bounce');
    }
  };

  btnRestartChallenge.addEventListener('click', () => {
    reportModal.style.display = 'none';
    window.typoGame.startChallengeMode(false);
    startChallengeCountdown(() => {
      window.typoGame.startChallengeTimer();
    });
  });

  // ================= 荣耀排行榜交互与渲染逻辑 =================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderLeaderboard(highlightId = null) {
    if (!leaderboardList || !window.scoreStorage) return;

    if (playerNicknameInput) {
      playerNicknameInput.value = window.scoreStorage.getPlayerName();
    }

    const scores = window.scoreStorage.getScores();

    if (!scores || scores.length === 0) {
      leaderboardList.innerHTML = `
        <div class="empty-leaderboard">
          <span class="empty-icon">🎮</span>
          <div class="empty-title">暂无荣耀排行记录</div>
          <div class="empty-desc">前往【极速挑战】冲刺一次，即可把你的得分永久记录在荣耀榜上！✨</div>
        </div>
      `;
      return;
    }

    leaderboardList.innerHTML = scores.slice(0, 20).map((item, index) => {
      const rank = index + 1;
      let badgeHtml = rank;
      let rankClass = '';

      if (rank === 1) {
        badgeHtml = '🥇';
        rankClass = 'rank-1';
      } else if (rank === 2) {
        badgeHtml = '🥈';
        rankClass = 'rank-2';
      } else if (rank === 3) {
        badgeHtml = '🥉';
        rankClass = 'rank-3';
      }

      const isNewHighlight = item.id === highlightId ? 'highlight-new' : '';

      return `
        <div class="rank-card ${rankClass} ${isNewHighlight}">
          <div class="rank-left-group">
            <div class="rank-badge-col">${badgeHtml}</div>
            <div class="rank-meta-info">
              <div class="rank-player-name">
                <span>${escapeHtml(item.name || 'Kyrie')}</span>
                <span title="${escapeHtml(item.tierName || '')}">${item.tierIcon || '🐢'}</span>
              </div>
              <div class="rank-stats-pills">
                <span class="stat-tag-wpm">⚡ ${item.wpm || 0} WPM</span>
                <span class="stat-tag-combo">🔥 ${item.maxCombo || 0} 连击</span>
                <span class="stat-tag-words">🎯 ${item.wordsCount || 0} 词</span>
              </div>
            </div>
          </div>
          <div class="rank-right-group">
            <div class="rank-score-val">⭐ ${item.score || 0}</div>
            <div class="rank-date-str">${escapeHtml(item.dateStr || '')}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function openLeaderboard(highlightId = null) {
    window.soundFX.playTabSwitch();
    renderLeaderboard(highlightId);
    if (leaderboardModal) {
      leaderboardModal.style.display = 'flex';
    }
  }

  function closeLeaderboard() {
    if (leaderboardModal) {
      leaderboardModal.style.display = 'none';
    }
  }

  // 绑定排行榜事件监听
  if (btnOpenLeaderboard) {
    btnOpenLeaderboard.addEventListener('click', () => openLeaderboard());
  }

  if (btnOpenLeaderboardFromReport) {
    btnOpenLeaderboardFromReport.addEventListener('click', () => {
      reportModal.style.display = 'none';
      openLeaderboard(lastPlayedRecordId);
    });
  }

  if (btnCloseLeaderboard) {
    btnCloseLeaderboard.addEventListener('click', closeLeaderboard);
  }

  if (btnCloseLeaderboardBottom) {
    btnCloseLeaderboardBottom.addEventListener('click', closeLeaderboard);
  }

  if (leaderboardModal) {
    leaderboardModal.addEventListener('click', (e) => {
      if (e.target === leaderboardModal) {
        closeLeaderboard();
      }
    });
  }

  if (btnSaveNickname && playerNicknameInput) {
    btnSaveNickname.addEventListener('click', () => {
      const newName = window.scoreStorage.setPlayerName(playerNicknameInput.value);
      playerNicknameInput.value = newName;
      if (warriorCurrentName) warriorCurrentName.textContent = newName;
      if (nameSaveTip) {
        nameSaveTip.classList.add('show');
        setTimeout(() => nameSaveTip.classList.remove('show'), 1600);
      }
      renderLeaderboard();
    });
    playerNicknameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        btnSaveNickname.click();
      }
    });
  }

  if (btnClearScores) {
    btnClearScores.addEventListener('click', () => {
      if (confirm('确定要清空所有荣耀得分记录吗？清空后将无法找回哦。')) {
        window.scoreStorage.clearScores();
        lastPlayedRecordId = null;
        renderLeaderboard();
      }
    });
  }

  // ================= 4. 少儿键盘与指法启蒙教学中枢逻辑 =================
  const btnGuidePosture = document.getElementById('btnGuidePosture');
  const btnGuideHands = document.getElementById('btnGuideHands');
  const btnGuideQuest = document.getElementById('btnGuideQuest');
  const btnGuideFuncKeys = document.getElementById('btnGuideFuncKeys');

  const viewGuidePosture = document.getElementById('viewGuidePosture');
  const viewGuideHands = document.getElementById('viewGuideHands');
  const viewGuideQuest = document.getElementById('viewGuideQuest');
  const viewGuideFuncKeys = document.getElementById('viewGuideFuncKeys');

  const btnSpeakPosture = document.getElementById('btnSpeakPosture');
  const detailFingerText = document.getElementById('detailFingerText');
  const detailFingerIcon = document.getElementById('detailFingerIcon');

  const graduationCert = document.getElementById('graduationCert');
  const certHeroName = document.getElementById('certHeroName');
  const certDateStr = document.getElementById('certDateStr');
  const btnReplayQuest = document.getElementById('btnReplayQuest');

  const funcKeysGrid = document.getElementById('funcKeysGrid');
  const funcKeysLayoutTip = document.getElementById('funcKeysLayoutTip');

  function switchGuideSubTab(tabName) {
    window.keyboardGuide.setGuideTab(tabName);

    const tabs = [
      { id: btnGuidePosture, view: viewGuidePosture, name: 'posture' },
      { id: btnGuideHands, view: viewGuideHands, name: 'hands' },
      { id: btnGuideQuest, view: viewGuideQuest, name: 'quest' },
      { id: btnGuideFuncKeys, view: viewGuideFuncKeys, name: 'funckeys' }
    ];

    tabs.forEach(t => {
      const isActive = (t.name === tabName);
      if (t.id) t.id.classList.toggle('active', isActive);
      if (t.view) t.view.style.display = isActive ? 'flex' : 'none';
    });

    clearFingerKeyboardHighlights();

    if (tabName === 'quest') {
      renderTutorialStep();
    } else if (tabName === 'funckeys') {
      renderFuncKeysGrid();
      highlightTargetKeyboardKey(null);
    } else {
      highlightTargetKeyboardKey(null);
    }
    autoFitViewport();
  }

  if (btnGuidePosture) btnGuidePosture.addEventListener('click', () => { window.soundFX.playTabSwitch(); switchGuideSubTab('posture'); });
  if (btnGuideHands) btnGuideHands.addEventListener('click', () => { window.soundFX.playTabSwitch(); switchGuideSubTab('hands'); });
  if (btnGuideQuest) btnGuideQuest.addEventListener('click', () => { window.soundFX.playTabSwitch(); switchGuideSubTab('quest'); });
  if (btnGuideFuncKeys) btnGuideFuncKeys.addEventListener('click', () => { window.soundFX.playTabSwitch(); switchGuideSubTab('funckeys'); });

  // 播放手型口诀语音
  if (btnSpeakPosture) {
    btnSpeakPosture.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = "手心里抱小苹果，手指弯弯像小爪；指尖立在键帽上，手腕悬平不贴桌！";
      window.speechEngine.speakChinese(text);
    });
  }

  // 双手指法地图点击与联动
  function pulseHandFinger(fingerKey) {
    document.querySelectorAll(`.finger-unit[data-finger="${fingerKey}"]`).forEach(el => {
      el.classList.remove('bouncing');
      void el.offsetHeight;
      el.classList.add('bouncing');
      setTimeout(() => el.classList.remove('bouncing'), 400);
    });
  }

  function highlightFingerKeysOnKeyboard(fingerKey) {
    clearFingerKeyboardHighlights();
    const info = window.keyboardGuide.fingerColors[fingerKey];
    if (!info) return;

    info.keys.forEach(k => {
      let sel = `.apple-key[data-key="${k.toLowerCase()}"]`;
      if (k === ' ') sel = '.apple-key[data-key=" "]';
      if (k.toLowerCase() === 'enter') sel = '.apple-key[data-key="Enter"]';
      if (k.toLowerCase() === 'backspace' || k.toLowerCase() === 'delete') sel = '.apple-key[data-key="Backspace"]';
      document.querySelectorAll(sel).forEach(keyEl => {
        keyEl.classList.add('highlight-target');
      });
    });
  }

  function clearFingerKeyboardHighlights() {
    document.querySelectorAll('.apple-key.highlight-target').forEach(el => el.classList.remove('highlight-target'));
  }

  document.querySelectorAll('.finger-unit').forEach(unit => {
    unit.addEventListener('click', () => {
      const fingerKey = unit.getAttribute('data-finger');
      highlightFingerKeysOnKeyboard(fingerKey);
      pulseHandFinger(fingerKey);

      const rhyme = window.keyboardGuide.fingerRhythms[fingerKey] || '按键专属手指';
      if (detailFingerText) {
        detailFingerText.innerHTML = `<strong>${unit.getAttribute('title') || ''}</strong>：${rhyme}`;
      }
      if (detailFingerIcon) {
        detailFingerIcon.textContent = '🎯';
      }
    });
  });

  // 渲染功能键小图鉴
  function renderFuncKeysGrid() {
    if (!funcKeysGrid) return;
    const isMac = (currentKeyboardLayout === 'mac');
    if (funcKeysLayoutTip) {
      funcKeysLayoutTip.textContent = isMac ? '当前适配：🍎 Mac (苹果) 键盘' : '当前适配：💻 PC (Windows) 标准键盘';
    }
    const data = window.keyboardGuide.getFuncKeysData(currentKeyboardLayout);
    funcKeysGrid.innerHTML = data.map(item => `
      <div class="funckey-item-card">
        <div class="funckey-card-top">
          <div class="funckey-badge">
            <span>${item.symbol}</span>
            <span>${item.key}</span>
          </div>
          <button class="funckey-btn-try" data-action="${item.actionKey}" type="button">试按一下 ⚡</button>
        </div>
        <div class="funckey-name-title">${item.name}</div>
        <p class="funckey-desc-text">${item.desc}</p>
      </div>
    `).join('');

    funcKeysGrid.querySelectorAll('.funckey-btn-try').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        triggerVirtualKeyPress(action);
        window.soundFX.playKeyPop(2);
        setTimeout(() => triggerVirtualKeyRelease(action), 220);
      });
    });
  }

  // 闯关关卡渲染
  function renderTutorialStep() {
    const step = window.keyboardGuide.getCurrentStepData();
    if (!step) return;

    if (graduationCert) graduationCert.style.display = 'none';
    if (tutorialTitle) tutorialTitle.innerHTML = step.title;
    if (tutorialBadge) tutorialBadge.textContent = `🏷️ ${step.badge}`;
    if (tutorialDesc) tutorialDesc.innerHTML = step.desc;
    if (tutorialPromptBox) tutorialPromptBox.innerHTML = step.interactivePrompt;
    if (tutorialHint) tutorialHint.textContent = `💡 ${step.tip}`;
    if (btnNextStep) btnNextStep.style.display = 'none';

    stepChips.forEach(chip => {
      const s = parseInt(chip.getAttribute('data-step'), 10);
      chip.classList.toggle('active', s === window.keyboardGuide.currentStep);
      chip.classList.toggle('done', s < window.keyboardGuide.currentStep);
    });

    const targetKey = step.targets[step.currentTargetIdx];
    highlightTargetKeyboardKey(targetKey);
    if (targetKey) {
      const fInfo = window.keyboardGuide.getFingerForChar(targetKey);
      if (fInfo && fInfo.finger) pulseHandFinger(fInfo.finger);
    }
  }

  stepChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const s = parseInt(chip.getAttribute('data-step'), 10);
      window.keyboardGuide.goToStep(s);
      renderTutorialStep();
    });
  });

  if (btnNextStep) {
    btnNextStep.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playTabSwitch();
      if (window.keyboardGuide.currentStep < window.keyboardGuide.totalSteps) {
        window.keyboardGuide.goToStep(window.keyboardGuide.currentStep + 1);
        renderTutorialStep();
      }
    });
  }

  if (btnReplayQuest) {
    btnReplayQuest.addEventListener('click', () => {
      window.keyboardGuide.goToStep(1);
      renderTutorialStep();
    });
  }

  // 全局点击按钮后立即释放焦点（防止用户敲击空格时被浏览器默认当成“点击当前聚焦按钮”而重置游戏）
  document.addEventListener('click', (e) => {
    const btn = e.target && e.target.closest ? e.target.closest('button') : null;
    if (btn) {
      btn.blur();
    }
  });

  // ================= 5. 全局物理按键与虚拟键盘联动 =================
  window.addEventListener('keydown', (e) => {
    // 若正在输入框（如修改玩家称号昵称）中输入，允许正常敲击空格和字符
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }

    // 彻底阻止浏览器默认行为：
    if (e.key === ' ' || e.code === 'Space' || e.key === 'Tab') {
      e.preventDefault();
    }

    if (e.repeat) return; // 忽略长按重复
    const key = e.key;

    // 若开场动画尚未关闭
    if (mimimiSplash && !mimimiSplash.classList.contains('hidden')) {
      const isInputting = warriorRegisterBox && warriorRegisterBox.style.display !== 'none';
      const hasCustom = window.scoreStorage && window.scoreStorage.hasCustomName();
      if (!hasCustom || isInputting) {
        if (splashWarriorInput && document.activeElement !== splashWarriorInput) {
          splashWarriorInput.focus();
        }
        return;
      }
      dismissSplashAndEnter();
      return;
    }

    // 若挑战战备就绪确认弹窗处于打开状态
    if (challengeStartModal && challengeStartModal.style.display === 'flex') {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        challengeStartModal.style.display = 'none';
        switchTab('challenge');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        challengeStartModal.style.display = 'none';
      }
      return;
    }

    // 若退出二次确认弹窗处于打开状态
    if (exitConfirmModal && exitConfirmModal.style.display === 'flex') {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        exitConfirmModal.style.display = 'none';
        if (window.typoGame) window.typoGame.resumeChallengeTimer();
        pendingSwitchMode = null;
      }
      return;
    }

    // 若极速挑战结算弹窗处于打开状态
    if (reportModal && reportModal.style.display === 'flex') {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        reportModal.style.display = 'none';
        window.typoGame.startChallengeMode(false);
        startChallengeCountdown(() => {
          window.typoGame.startChallengeTimer();
        });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        reportModal.style.display = 'none';
      }
      return;
    }

    // 若排行榜弹窗处于打开状态
    if (leaderboardModal && leaderboardModal.style.display === 'flex') {
      if (e.key === 'Escape') {
        e.preventDefault();
        leaderboardModal.style.display = 'none';
      }
      return;
    }

    // 若极速挑战 3, 2, 1 倒计时正在进行中，忽略打字判定
    if (isCountdownActive) {
      return;
    }

    // 虚拟键盘按压下沉视觉反馈
    triggerVirtualKeyPress(key);

    if (currentActiveTab === 'tutorial') {
      // 触发双手地图对应手指跳动
      const fInfo = window.keyboardGuide.getFingerForChar(key);
      if (fInfo && fInfo.finger) {
        pulseHandFinger(fInfo.finger);
      }

      if (window.keyboardGuide.activeGuideTab === 'quest') {
        // 若当前关卡已完成且“闯入下一关”按钮可见，支持按 Enter 回车键（或空格）直接进入下一关
        if (btnNextStep && btnNextStep.style.display !== 'none') {
          if (key === 'Enter' || key === ' ' || e.code === 'Space') {
            e.preventDefault();
            btnNextStep.click();
            return;
          }
        }

        // 若已通关展出荣誉证书，按 Enter 重新开始挑战
        if (graduationCert && graduationCert.style.display === 'flex' && key === 'Enter') {
          if (btnReplayQuest) {
            e.preventDefault();
            btnReplayQuest.click();
            return;
          }
        }

        const res = window.keyboardGuide.handleKeyPress(key);
        if (res.success) {
          window.soundFX.playKeyPop(2);
          if (res.stepFinished) {
            window.soundFX.playFanfare();
            if (res.isFinal) {
              if (graduationCert) {
                graduationCert.style.display = 'flex';
                if (certHeroName) {
                  certHeroName.textContent = window.scoreStorage ? window.scoreStorage.getPlayerName() : 'Kyrie';
                }
                if (certDateStr) {
                  const now = new Date();
                  certDateStr.textContent = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;
                }
              }
              tutorialPromptBox.innerHTML = `🎉 恭喜你全部通关！荣获<strong>【全能盲打小勇士】</strong>最高荣誉证书！`;
              btnNextStep.style.display = 'none';
              highlightTargetKeyboardKey(null);
            } else {
              tutorialPromptBox.innerHTML = `🎉 太棒啦！你已经完成了本关卡！解锁了 <strong>${res.badge}</strong>！`;
              btnNextStep.style.display = 'inline-block';
              highlightTargetKeyboardKey(null);
            }
          } else {
            highlightTargetKeyboardKey(res.nextKey);
            if (res.nextKey) {
              const nextFInfo = window.keyboardGuide.getFingerForChar(res.nextKey);
              if (nextFInfo && nextFInfo.finger) pulseHandFinger(nextFInfo.finger);
            }
          }
        } else {
          window.soundFX.playKeyWrong();
        }
      }
    } else {
      // 单词探索或极速挑战模式
      if (isAwaitingStart && window.typoGame && window.typoGame.mode === 'practice') {
        if (key === 'Enter') {
          e.preventDefault();
          startTypingSession();
          return;
        }
        if (key.length === 1 && /[a-zA-Z]/.test(key)) {
          const wordObj = window.typoGame.getCurrentWordObj();
          if (wordObj && wordObj.word && key.toLowerCase() === wordObj.word[0].toLowerCase()) {
            // 首字母盲敲穿透触发：顺畅起跑并击中第一颗字母
            e.preventDefault();
            startTypingSession(key);
            return;
          } else {
            // 误敲其他字母：柔和提示右手小指敲击 Enter
            e.preventDefault();
            if (window.soundFX && window.soundFX.playKeyWrong) {
              window.soundFX.playKeyWrong();
            }
            showModeToast('⌨️', '请敲击 Enter (回车) 开启冒险哦！');
            return;
          }
        }
        return;
      }

      if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        window.typoGame.handleKeyInput(key);
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    triggerVirtualKeyRelease(e.key);
  });

  function triggerVirtualKeyPress(key) {
    let selector = `.apple-key[data-key="${key.toLowerCase()}"]`;
    if (key === ' ') selector = '.apple-key[data-key=" "]';
    if (key === 'Enter') selector = '.apple-key[data-key="Enter"]';
    if (key === 'Backspace') selector = '.apple-key[data-key="Backspace"]';
    if (key === 'Tab') selector = '.apple-key[data-key="Tab"]';
    if (key === 'CapsLock') selector = '.apple-key[data-key="CapsLock"]';
    if (key === 'Shift') selector = '.apple-key[data-key="Shift"]';
    if (key === 'Control') selector = '.apple-key[data-key="Control"]';
    if (key === 'Alt') selector = '.apple-key[data-key="Alt"]';
    if (key === 'Meta') selector = '.apple-key[data-key="Meta"]';

    document.querySelectorAll(selector).forEach(el => el.classList.add('pressed'));
  }

  function triggerVirtualKeyRelease(key) {
    let selector = `.apple-key[data-key="${key.toLowerCase()}"]`;
    if (key === ' ') selector = '.apple-key[data-key=" "]';
    if (key === 'Enter') selector = '.apple-key[data-key="Enter"]';
    if (key === 'Backspace') selector = '.apple-key[data-key="Backspace"]';
    if (key === 'Tab') selector = '.apple-key[data-key="Tab"]';
    if (key === 'CapsLock') selector = '.apple-key[data-key="CapsLock"]';
    if (key === 'Shift') selector = '.apple-key[data-key="Shift"]';
    if (key === 'Control') selector = '.apple-key[data-key="Control"]';
    if (key === 'Alt') selector = '.apple-key[data-key="Alt"]';
    if (key === 'Meta') selector = '.apple-key[data-key="Meta"]';

    document.querySelectorAll(selector).forEach(el => el.classList.remove('pressed'));
  }

  // 防作弊机制：虚拟键盘仅供指引与雷达指示，彻底禁用鼠标点击输入
  let lastMouseClickWarnTime = 0;
  function bindKeyElementsEvents() {
    document.querySelectorAll('.apple-key').forEach(keyEl => {
      if (keyEl._hasTypoListener) return;
      keyEl._hasTypoListener = true;
      keyEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 杜绝用鼠标点击虚拟键帽作弊：不触发任何输入，弹出趣味提醒
        const now = Date.now();
        if (now - lastMouseClickWarnTime > 2000) {
          lastMouseClickWarnTime = now;
          showModeToast('⌨️', '请敲击真实键盘打字哦，鼠标点击已禁用！');
          if (window.soundFX && window.soundFX.playKeyMiss) {
            window.soundFX.playKeyMiss();
          }
        }
      });
    });
  }

  // 初始化绑定所有静态按键
  bindKeyElementsEvents();

  // 音频控制
  btnToggleSound.addEventListener('click', () => {
    const isMuted = window.soundFX.toggleMute();
    btnToggleSound.textContent = isMuted ? '🔇' : '🔊';
  });

  btnToggleSpeech.addEventListener('click', () => {
    const isEnabled = window.speechEngine.toggleSpeech();
    btnToggleSpeech.textContent = isEnabled ? '🗣️' : '🤫';
  });

  // 全屏专注模式控制 (支持 F11、Esc 与按钮联动)
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => console.warn('全屏请求被阻止:', err));
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.warn('退出全屏失败:', err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function updateFullscreenBtnState() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (btnToggleFullscreen) {
      btnToggleFullscreen.textContent = isFs ? '🗗' : '⛶';
      btnToggleFullscreen.title = isFs ? '退出全屏专注模式 (Esc / F11)' : '开启全屏专注模式 (F11)';
      btnToggleFullscreen.classList.toggle('active', isFs);
    }
  }

  if (btnToggleFullscreen) {
    btnToggleFullscreen.addEventListener('click', toggleFullscreen);
  }
  document.addEventListener('fullscreenchange', updateFullscreenBtnState);
  document.addEventListener('webkitfullscreenchange', updateFullscreenBtnState);

  // 1. 默认应用 PC (Windows) 键盘模式
  setKeyboardLayout('pc');

  // 2. 初始化剑桥少儿英语 PU 核心教材单元点播器
  setupCurriculumSelector();

  // 3. 默认从“单词探索”模式启动（跳过初始 Toast）
  switchTab('practice', true);

  // 3. 页面初次加载：单次播放 Mimimi 招牌弹射动画（1.3秒后自动淡出进入主界面）
  playMimimiAnimation();
});


