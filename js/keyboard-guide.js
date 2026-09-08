// Kyrie's Typo - 少儿键盘与指法启蒙教学中枢逻辑 (Keyboard Guide Engine)

class KeyboardGuide {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.targetKey = null;
    this.stepCompleted = false;
    this.layout = 'pc'; // 'pc' | 'mac'
    this.activeGuideTab = 'posture'; // 'posture' | 'hands' | 'quest' | 'funckeys'

    // 指法色彩与手指映射
    this.fingerColors = {
      leftPinky: { name: "左手小拇指", color: "#FF6584", keys: ["a", "q", "z", "1", "`", "tab", "capslock", "shift"] },
      leftRing: { name: "左手无名指", color: "#FFA45B", keys: ["s", "w", "x", "2"] },
      leftMiddle: { name: "左手中指", color: "#10B981", keys: ["d", "e", "c", "3"] },
      leftIndex: { name: "左手食指", color: "#38BDF8", keys: ["f", "r", "v", "g", "t", "b", "4", "5"] },
      thumb: { name: "大拇指（左右通用）", color: "#A855F7", keys: [" "] },
      rightIndex: { name: "右手食指", color: "#38BDF8", keys: ["j", "u", "m", "h", "y", "n", "6", "7"] },
      rightMiddle: { name: "右手中指", color: "#10B981", keys: ["k", "i", ",", "8"] },
      rightRing: { name: "右手无名指", color: "#FFA45B", keys: ["l", "o", ".", "9"] },
      rightPinky: { name: "右手小拇指", color: "#FF6584", keys: [";", "p", "/", "0", "-", "=", "[", "]", "'", "delete", "return", "enter", "backspace"] }
    };

    // 手指儿童趣味介绍口诀
    this.fingerRhythms = {
      leftPinky: "粉色左手小指：守住基准 A 键，负责管辖 A、Q、Z、1、Tab 与 Shift！",
      leftRing: "橙色左手无名指：守住基准 S 键，负责管辖 S、W、X、2 四颗星！",
      leftMiddle: "绿色左手中指：守住基准 D 键，负责管辖 D、E、C、3 四颗星！",
      leftIndex: "天蓝左手食指小队长：安家在 F 小雷达上，负责 4、5、R、T、F、G、V、B 8 颗星！",
      thumb: "紫色大拇指双子星：轻轻悬在长长的 Space 空格键上，是单词宝宝的蹦蹦床！",
      rightIndex: "天蓝右手食指冲锋队长：安家在 J 小雷达上，负责 6、7、Y、U、H、J、N、M 8 颗星！",
      rightMiddle: "绿色右手中指：守住基准 K 键，负责管辖 K、I、逗号(,)、8 四颗星！",
      rightRing: "橙色右手无名指：守住基准 L 键，负责管辖 L、O、句号(.)、9 四颗星！",
      rightPinky: "粉色右手小指：守住分号(;)基准键，负责 P、斜杠(/)、Enter 回车与 Backspace！"
    };

    // 6 阶趣味闯关课程
    this.stepsData = [
      {
        step: 1,
        title: "第 1 关：摸一摸！找到 F 和 J 的小雷达 📡",
        badge: "探险雷达徽章 📡",
        desc: "无论是 PC 还是 Mac 键盘，都有两颗键藏着神奇秘密！闭上眼睛摸一摸，你能摸到表面有<strong>一条凸起小横杠</strong>的键吗？那就是 <strong>F</strong> 键和 <strong>J</strong> 键！这是左右手食指安家定位的小锚点！",
        interactivePrompt: "请在键盘上依次按下 <span class='target-key-pill'>F</span> 键和 <span class='target-key-pill'>J</span> 键！",
        targets: ["f", "j"],
        currentTargetIdx: 0,
        tip: "小提示：左手食指摸 F，右手食指摸 J，摸摸凸起的小横杠！"
      },
      {
        step: 2,
        title: "第 2 关：彩虹十指各就各位！基准键大点名 🌈",
        badge: "基准彩虹徽章 🌈",
        desc: "十指小队请入驻！食指停在 F 和 J 上，其余手指自然落下：左手入驻 <strong>A S D F</strong>，右手入驻 <strong>J K L ;</strong>，大拇指轻搭长长的空格键。十根手指各司其职，谁也不抢别人的位置！",
        interactivePrompt: "请试着用正确的手指敲击基准键：<span class='target-key-pill'>A</span> <span class='target-key-pill'>S</span> <span class='target-key-pill'>D</span> <span class='target-key-pill'>F</span> 和 <span class='target-key-pill'>J</span> <span class='target-key-pill'>K</span> <span class='target-key-pill'>L</span> <span class='target-key-pill'>;</span>",
        targets: ["a", "s", "d", "f", "j", "k", "l", ";"],
        currentTargetIdx: 0,
        tip: "粉小指按 A，橙无名指按 S，绿中指按 D，蓝食指按 F！"
      },
      {
        step: 3,
        title: "第 3 关：盲打核心法则！出击击打与速速归巢 🦅",
        badge: "归巢小鹰徽章 🦅",
        desc: "盲打的核心秘诀是：手指就像采蜜的小蜜蜂，出击敲完按键后，<strong>必须立刻回到基准键的家</strong>！试着用左手食指横移敲击 G，再立刻回 F；右手食指横移敲击 H，再立刻回 J！",
        interactivePrompt: "请连续敲出：<span class='target-key-pill'>F</span> ➔ <span class='target-key-pill'>G</span> ➔ <span class='target-key-pill'>F</span>，再敲 <span class='target-key-pill'>J</span> ➔ <span class='target-key-pill'>H</span> ➔ <span class='target-key-pill'>J</span>！",
        targets: ["f", "g", "f", "j", "h", "j"],
        currentTargetIdx: 0,
        tip: "敲完 G 立刻回 F，敲完 H 立刻回 J！归巢才安全！"
      },
      {
        step: 4,
        title: "第 4 关：大拇指蹦蹦床与功能键魔法 🚀",
        badge: "火箭魔杖徽章 🚀",
        desc: "长长的 Space 空格键是大拇指专属的蹦蹦床，给单词宝宝排排坐留出空间；Enter 回车键是换行小火箭，告诉电脑任务完成！",
        interactivePrompt: "请试着用大拇指按一下 <span class='target-key-pill'>Space 空格键</span>，然后按 <span class='target-key-pill'>Enter 回车键</span>！",
        targets: [" ", "Enter"],
        currentTargetIdx: 0,
        tip: "大拇指轻轻按空格，右手小指敲回车！"
      },
      {
        step: 5,
        title: "第 5 关：上下行探险家！食指与中指延伸击键 🧭",
        badge: "探险指南针徽章 🧭",
        desc: "基准行掌握之后，手指就可以去探险上下两行啦！左手中指向上敲 E，左手食指向上敲 R，右手食指向上敲 U，右手中指向上敲 I！敲完记得回巢哦！",
        interactivePrompt: "请依次敲出上排延伸键：<span class='target-key-pill'>E</span> ➔ <span class='target-key-pill'>R</span> ➔ <span class='target-key-pill'>U</span> ➔ <span class='target-key-pill'>I</span>！",
        targets: ["e", "r", "u", "i"],
        currentTargetIdx: 0,
        tip: "手指往上探险，按完轻轻缩回基准行！"
      },
      {
        step: 6,
        title: "第 6 关：新手小勇士终极考验！盲打连招 🏆",
        badge: "全能盲打小勇士奖杯 🏆",
        desc: "十指小分队总动员！不看键盘，凭借手指肌肉记忆敲出少儿超能单词：<strong>FAST JUMP</strong>（极速跳跃）！通关将颁发属于你的荣誉证书！",
        interactivePrompt: "请一气呵成敲出：<span class='target-key-pill'>F A S T</span> <span class='target-key-pill'>Space</span> <span class='target-key-pill'>J U M P</span>！",
        targets: ["f", "a", "s", "t", " ", "j", "u", "m", "p"],
        currentTargetIdx: 0,
        tip: "放轻松，深呼吸，感觉手指在键盘上的位置，你可以做到的！"
      }
    ];
  }

  setLayout(layout) {
    this.layout = layout; // 'pc' | 'mac'
  }

  setGuideTab(tabName) {
    this.activeGuideTab = tabName;
  }

  getCurrentStepData() {
    return this.stepsData[this.currentStep - 1];
  }

  goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
      this.currentStep = stepNumber;
      const step = this.getCurrentStepData();
      step.currentTargetIdx = 0;
      this.stepCompleted = false;
    }
  }

  // 处理教程模式下的按键
  handleKeyPress(keyChar) {
    const step = this.getCurrentStepData();
    if (this.stepCompleted) return { success: false, completed: true };

    const expectedKey = step.targets[step.currentTargetIdx];
    const isMatch = (keyChar.toLowerCase() === expectedKey.toLowerCase()) || 
                    (expectedKey === " " && keyChar === " ") ||
                    (expectedKey.toLowerCase() === "enter" && keyChar.toLowerCase() === "enter");

    if (isMatch) {
      step.currentTargetIdx++;
      if (step.currentTargetIdx >= step.targets.length) {
        this.stepCompleted = true;
        return {
          success: true,
          stepFinished: true,
          step: this.currentStep,
          badge: step.badge,
          isFinal: this.currentStep === this.totalSteps
        };
      }
      return {
        success: true,
        stepFinished: false,
        nextKey: step.targets[step.currentTargetIdx]
      };
    } else {
      return {
        success: false,
        expected: expectedKey
      };
    }
  }

  // 获取手指指导说明
  getFingerForChar(char) {
    const lower = char.toLowerCase();
    for (const [fingerKey, data] of Object.entries(this.fingerColors)) {
      if (data.keys.includes(lower)) {
        return { finger: fingerKey, name: data.name, color: data.color };
      }
    }
    return { finger: "general", name: "任意手指", color: "#7B61FF" };
  }

  // 获取功能键图鉴数据 (PC 与 Mac 自适应)
  getFuncKeysData(layout = this.layout) {
    if (layout === 'mac') {
      return [
        {
          key: "Space",
          symbol: "␣",
          name: "Space 空格键",
          desc: "键盘上最宽长的按键！大拇指专属蹦蹦床，给单词宝宝排排坐留出空间！",
          actionKey: " "
        },
        {
          key: "Delete",
          symbol: "⌫",
          name: "Delete 删除键",
          desc: "神奇小橡皮擦！写错字母按一下立刻擦掉光标左侧的字符！",
          actionKey: "Backspace"
        },
        {
          key: "Return",
          symbol: "↩",
          name: "Return 换行确认键",
          desc: "小火箭换行！告诉电脑任务完成、进入下一行！",
          actionKey: "Enter"
        },
        {
          key: "Command",
          symbol: "⌘",
          name: "Command 花键",
          desc: "苹果最强大的魔杖快捷键！⌘+C 复制、⌘+V 粘贴全靠它！",
          actionKey: "Meta"
        },
        {
          key: "Shift",
          symbol: "⇧",
          name: "Shift 上档键",
          desc: "大小写魔法帽！按住它不放再敲字母，字母瞬间变成威风大写！",
          actionKey: "Shift"
        },
        {
          key: "Option",
          symbol: "⌥",
          name: "Option 选项键",
          desc: "特殊符号百宝箱！配合其他按键可以变身打出各种数学与特殊符号！",
          actionKey: "Alt"
        }
      ];
    } else {
      return [
        {
          key: "Space",
          symbol: "␣",
          name: "Space 空格键",
          desc: "键盘上最宽长的按键！大拇指专属蹦蹦床，给单词宝宝排排坐留出空间！",
          actionKey: " "
        },
        {
          key: "Backspace",
          symbol: "⌫",
          name: "Backspace 退格键",
          desc: "神奇小橡皮擦！写错字母按一下立刻擦掉前面的字符！",
          actionKey: "Backspace"
        },
        {
          key: "Enter",
          symbol: "↵",
          name: "Enter 回车键",
          desc: "小火箭换行！告诉电脑任务完成、确认执行、进入下一行！",
          actionKey: "Enter"
        },
        {
          key: "Win",
          symbol: "⊞",
          name: "Win 徽标键",
          desc: "打开 Windows 魔法窗户！一键唤出开始菜单与应用搜索！",
          actionKey: "Meta"
        },
        {
          key: "Shift",
          symbol: "⇧",
          name: "Shift 上档键",
          desc: "大小写魔法帽！按住它不放再敲字母，字母瞬间变成威风大写！",
          actionKey: "Shift"
        },
        {
          key: "Ctrl",
          symbol: "Ctrl",
          name: "Ctrl 控制键",
          desc: "PC 最强大的快捷键基石！Ctrl+C 复制、Ctrl+V 粘贴超能组合！",
          actionKey: "Control"
        }
      ];
    }
  }
}

window.keyboardGuide = new KeyboardGuide();

