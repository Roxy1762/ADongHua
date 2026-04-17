// 统一视觉色板与风格参数
// 主色调：浅蓝、青绿、淡紫、珊瑚粉、米白

export const PALETTE = {
  // 背景
  bgTop: 0xf7fbfe,
  bgBottom: 0xe9f2fb,
  bgGlowA: 0xd8ecff,
  bgGlowB: 0xe3f6ef,

  // 基础墨色
  ink: 0x1b2a41,
  inkSoft: 0x3d5170,
  inkMuted: 0x6b7c99,

  // 主色
  blue: 0x6aa9e9,
  blueSoft: 0xa7cdf0,
  teal: 0x7bd0c1,
  tealSoft: 0xbfe6dd,
  violet: 0xc4a7e7,
  violetSoft: 0xe0cdf0,
  coral: 0xf5a69b,
  coralSoft: 0xfbd1c9,
  cream: 0xfbf4e4,

  // 实体色 —— 细胞
  bCell: 0xd6a7dc, // B 细胞 —— 淡紫粉
  bCellCore: 0xa66fbf,
  plasmaCell: 0xe79abf, // 浆细胞 —— 桃粉
  plasmaCore: 0xbf5a8a,
  memoryB: 0xb7d9ee, // 记忆B细胞 —— 浅蓝
  memoryBCore: 0x6aa9e9,

  helperT: 0x8fd3c4, // 辅助性T细胞 —— 青绿
  helperTCore: 0x3fa692,
  killerT: 0x7fb2e5, // 细胞毒性T细胞 —— 冷蓝
  killerTCore: 0x3a78c2,
  memoryT: 0xc7b8e6, // 记忆T细胞 —— 淡紫
  memoryTCore: 0x7c63b0,

  dendritic: 0xa9d4b8, // 树突状细胞 —— 浅青绿
  dendriticCore: 0x5aa184,
  macrophage: 0xd9b59b, // 巨噬细胞 —— 米棕
  macrophageCore: 0xa67252,
  infectedCell: 0xf3c8bc, // 被感染的宿主细胞 —— 暗珊瑚
  infectedCellCore: 0xd1715a,

  // 病原体 / 抗原
  virus: 0x8ab8a0,
  virusCore: 0x4a8f72,
  antigenSpike: 0xf5a69b, // 抗原决定簇 / 表面标签
  antigenSpike2: 0xf2d06b,

  // 抗体与细胞因子
  antibody: 0xc4a7e7,
  antibodyCore: 0x7c63b0,
  cytokine: 0xf5d48a,
  cytokineGlow: 0xffe9a8,

  // 标签
  labelBg: 0xffffff,
  labelBorder: 0xd6dfec,
  labelText: 0x1b2a41
} as const;

export const STYLE = {
  membraneAlpha: 0.9,
  cytoplasmAlpha: 0.55,
  glowAlpha: 0.25,
  lineWidth: 1.4,
  softLineWidth: 1,
  labelFontFamily:
    "PingFang SC, Hiragino Sans GB, Microsoft YaHei, -apple-system, sans-serif",
  captionFontFamily:
    "PingFang SC, Hiragino Sans GB, Microsoft YaHei, -apple-system, sans-serif"
} as const;

// 叙事文本常量（字幕与旁白）
// 包含教材原句与兼容扩展内容，自然编入各章节
export const NARRATION = {
  intro: [
    '周围环境中的病原体，大多数被健康的皮肤与黏膜阻挡；',
    '部分被体液中的杀菌物质和吞噬细胞清除。',
    '然而，总有"漏网之鱼"突破前两道防线——',
    '机体随即启动第三道防线：特异性免疫。'
  ],
  recognition: [
    '病原体表面的某些特定蛋白质等分子，能与免疫细胞表面的受体结合，',
    '这些能够引发免疫反应的物质称为抗原。',
    '免疫细胞依靠这些"身份标签"区分己方与敌方。'
  ],
  presentation: [
    'B 细胞、树突状细胞和巨噬细胞都能摄取和加工处理抗原，',
    '并将抗原信息暴露在细胞表面，呈递给其他免疫细胞。',
    '抗原呈递细胞是连接初步防御与特异性免疫的桥梁。'
  ],
  helperActivation: [
    '辅助性 T 细胞接收抗原信息后被活化，释放细胞因子，',
    '在体液免疫与细胞免疫中都起着关键的协调作用。'
  ],
  humoral: [
    'B 细胞受到抗原刺激、并在辅助性 T 细胞协助下被激活，',
    '大部分增殖分化为浆细胞，小部分分化为记忆 B 细胞。',
    '浆细胞分泌抗体——机体产生的专门应对抗原的蛋白质称为抗体。'
  ],
  humoralBinding: [
    '抗体能与相应抗原发生特异性结合。',
    '抗体与抗原结合后，可中和病原体、阻止其侵染，',
    '并使其更容易被吞噬细胞清除。',
    '由于抗体存在于体液中，这种主要靠抗体"作战"的方式称为体液免疫。'
  ],
  cellular: [
    '病毒等病原体只有侵入细胞才能增殖。',
    '当病原体进入细胞内部，抗体便难以发挥作用。',
    '此时就要靠 T 细胞直接接触靶细胞来"作战"——这种方式称为细胞免疫。'
  ],
  cellularKilling: [
    '细胞毒性 T 细胞识别并裂解被同样病原体感染的靶细胞，',
    '使病原体失去寄生的基础，再被抗体结合或被其他免疫细胞吞噬清除。'
  ],
  memory: [
    '免疫应答过程中形成的记忆细胞可在抗原消失后存活数年甚至几十年。',
    '当再次接触同种抗原时，记忆细胞迅速增殖、分化，',
    '快速产生大量抗体或效应 T 细胞——二次免疫应答更快、更强。'
  ],
  summary: [
    '体液免疫善于清除内环境中的游离病原体；',
    '细胞免疫负责清除已被感染的宿主细胞。',
    '二者与吞噬清除等过程巧妙配合、密切合作，',
    '共同完成对机体稳态的调节与维护。'
  ]
} as const;
