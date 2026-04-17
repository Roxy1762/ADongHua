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
    'B 细胞借助表面受体（BCR）与抗原特异性结合，获得第一激活信号（信号₁）；',
    '同时需要辅助性 T 细胞提供协同刺激（信号₂），才能充分激活。',
    '激活的 B 细胞大量增殖——克隆扩增——多数分化为浆细胞，少数成为记忆 B 细胞。'
  ],
  humoralBinding: [
    '浆细胞每秒可分泌数千个抗体分子，抗体与相应抗原特异性结合后，',
    '可阻止病原体侵入细胞、促进吞噬细胞的吞噬，也可激活补体系统直接裂解病原体。',
    '由于抗体存在于血液、组织液等体液中，这一过程称为体液免疫。'
  ],
  cellular: [
    '病毒等胞内病原体在宿主细胞内增殖，被感染的细胞称为靶细胞。',
    '靶细胞以 MHC-Ⅰ 类分子的形式将病毒肽段呈递于细胞表面，',
    '为细胞毒性 T 细胞（CTL）识别提供靶标——这是细胞免疫的核心前提。'
  ],
  cellularKilling: [
    'CTL 与靶细胞直接接触后，释放穿孔素在靶细胞膜上打孔，',
    '并导入颗粒酶诱导靶细胞凋亡。靶细胞裂解后，',
    '病原体暴露于胞外，由抗体与巨噬细胞协同清除。'
  ],
  memory: [
    '首次免疫应答：初始淋巴细胞需缓慢激活，7–14 天后达到应答高峰；',
    '同时产生长寿命记忆细胞，抗原消失后仍可存活数年至数十年。',
    '再次遭遇同种抗原时，记忆细胞迅速增殖，1–3 天即达更高峰值，',
    '产生的抗体量更多、亲和力更强——这就是二次免疫应答。'
  ],
  summary: [
    '体液免疫善于清除内环境中的游离病原体；',
    '细胞免疫负责清除已被感染的宿主细胞。',
    '二者与吞噬清除等过程巧妙配合、密切合作，',
    '共同完成对机体稳态的调节与维护。'
  ]
} as const;
