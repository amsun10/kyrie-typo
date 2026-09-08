// Kyrie Typo - 单词库（按主题与难度分级）
// 包含儿童常用释义、Emoji 图标、自然拼读音素切分

window.WORD_DATABASE = [
  // --- 级别 1：基础 CVC 简单 3 字母拼读词 ---
  { word: "cat", chinese: "猫咪", emoji: "🐱", phonics: ["c", "a", "t"], category: "animals", level: 1 },
  { word: "dog", chinese: "小狗", emoji: "🐶", phonics: ["d", "o", "g"], category: "animals", level: 1 },
  { word: "pig", chinese: "小猪", emoji: "🐷", phonics: ["p", "i", "g"], category: "animals", level: 1 },
  { word: "fox", chinese: "狐狸", emoji: "🦊", phonics: ["f", "o", "x"], category: "animals", level: 1 },
  { word: "sun", chinese: "太阳", emoji: "☀️", phonics: ["s", "u", "n"], category: "nature", level: 1 },
  { word: "bus", chinese: "巴士 / 公交车", emoji: "🚌", phonics: ["b", "u", "s"], category: "objects", level: 1 },
  { word: "cup", chinese: "水杯", emoji: "🥛", phonics: ["c", "u", "p"], category: "objects", level: 1 },
  { word: "hat", chinese: "帽子", emoji: "🧢", phonics: ["h", "a", "t"], category: "objects", level: 1 },
  { word: "red", chinese: "红色", emoji: "🔴", phonics: ["r", "e", "d"], category: "colors", level: 1 },
  { word: "box", chinese: "盒子", emoji: "📦", phonics: ["b", "o", "x"], category: "objects", level: 1 },
  { word: "egg", chinese: "鸡蛋", emoji: "🥚", phonics: ["e", "g", "g"], category: "food", level: 1 },
  { word: "run", chinese: "跑步", emoji: "🏃", phonics: ["r", "u", "n"], category: "actions", level: 1 },
  { word: "fly", chinese: "飞翔", emoji: "✈️", phonics: ["f", "l", "y"], category: "actions", level: 1 },

  // --- 级别 2：4 字母常见词与动物食物 ---
  { word: "lion", chinese: "狮子", emoji: "🦁", phonics: ["l", "i", "o", "n"], category: "animals", level: 2 },
  { word: "bear", chinese: "小熊", emoji: "🐻", phonics: ["b", "e", "a", "r"], category: "animals", level: 2 },
  { word: "duck", chinese: "鸭子", emoji: "🦆", phonics: ["d", "u", "c", "k"], category: "animals", level: 2 },
  { word: "fish", chinese: "小鱼", emoji: "🐟", phonics: ["f", "i", "s", "h"], category: "animals", level: 2 },
  { word: "frog", chinese: "青蛙", emoji: "🐸", phonics: ["f", "r", "o", "g"], category: "animals", level: 2 },
  { word: "milk", chinese: "牛奶", emoji: "🥛", phonics: ["m", "i", "l", "k"], category: "food", level: 2 },
  { word: "cake", chinese: "蛋糕", emoji: "🎂", phonics: ["c", "a", "k", "e"], category: "food", level: 2 },
  { word: "tree", chinese: "大树", emoji: "🌳", phonics: ["t", "r", "e", "e"], category: "nature", level: 2 },
  { word: "star", chinese: "星星", emoji: "⭐", phonics: ["s", "t", "a", "r"], category: "nature", level: 2 },
  { word: "moon", chinese: "月亮", emoji: "🌙", phonics: ["m", "o", "o", "n"], category: "nature", level: 2 },
  { word: "book", chinese: "书本", emoji: "📖", phonics: ["b", "o", "o", "k"], category: "objects", level: 2 },
  { word: "blue", chinese: "蓝色", emoji: "🔵", phonics: ["b", "l", "u", "e"], category: "colors", level: 2 },
  { word: "pink", chinese: "粉色", emoji: "🌸", phonics: ["p", "i", "n", "k"], category: "colors", level: 2 },
  { word: "jump", chinese: "跳跃", emoji: "🦘", phonics: ["j", "u", "m", "p"], category: "actions", level: 2 },
  { word: "play", chinese: "玩耍", emoji: "🎮", phonics: ["p", "l", "a", "y"], category: "actions", level: 2 },

  // --- 级别 3：5 字母及以上生动词汇 ---
  { word: "apple", chinese: "苹果", emoji: "🍎", phonics: ["a", "p", "p", "l", "e"], category: "food", level: 3 },
  { word: "tiger", chinese: "老虎", emoji: "🐯", phonics: ["t", "i", "g", "e", "r"], category: "animals", level: 3 },
  { word: "panda", chinese: "大熊猫", emoji: "🐼", phonics: ["p", "a", "n", "d", "a"], category: "animals", level: 3 },
  { word: "koala", chinese: "考拉", emoji: "🐨", phonics: ["k", "o", "a", "l", "a"], category: "animals", level: 3 },
  { word: "banana", chinese: "香蕉", emoji: "🍌", phonics: ["b", "a", "n", "a", "n", "a"], category: "food", level: 3 },
  { word: "orange", chinese: "橙子", emoji: "🍊", phonics: ["o", "r", "a", "n", "g", "e"], category: "food", level: 3 },
  { word: "rocket", chinese: "火箭", emoji: "🚀", phonics: ["r", "o", "c", "k", "e", "t"], category: "objects", level: 3 },
  { word: "rabbit", chinese: "小兔子", emoji: "🐰", phonics: ["r", "a", "b", "b", "i", "t"], category: "animals", level: 3 },
  { word: "flower", chinese: "花朵", emoji: "🌸", phonics: ["f", "l", "o", "w", "e", "r"], category: "nature", level: 3 },
  { word: "rainbow", chinese: "彩虹", emoji: "🌈", phonics: ["r", "a", "i", "n", "b", "o", "w"], category: "nature", level: 3 },
  { word: "monkey", chinese: "猴子", emoji: "🐵", phonics: ["m", "o", "n", "k", "e", "y"], category: "animals", level: 3 }
];
