# 特异性免疫过程动态演示

一个面向高中生物教学的交互式动画网页，使用代码精确、流畅、现代地呈现「抗原侵入体内后，引发体液免疫与细胞免疫的全过程」。

## 项目简介

本项目以人教版《稳态与调节》第 4 章「免疫调节」中的特异性免疫为原型，通过 6 个串联的章节动画，在浏览器中动态演绎：

1. 第 1 章 病原体入侵与抗原识别
2. 第 2 章 抗原呈递与辅助性 T 细胞激活
3. 第 3 章 体液免疫过程
4. 第 4 章 细胞免疫过程
5. 第 5 章 记忆细胞与二次免疫应答
6. 第 6 章 体液免疫与细胞免疫协同总结

所有动画帧、场景转场、镜头推进均由 GSAP 时间轴驱动，视觉元素由 PixiJS 在 16:9 自适应画布上实时绘制，适合课堂展示或自学。

## 技术栈

- **Vite** —— 构建与开发服务器
- **TypeScript** —— 类型安全
- **PixiJS 7** —— 2D WebGL 渲染
- **GSAP 3** —— 动画时间轴与缓动

不依赖任何后端服务或数据库，也未引入 React / Vue / Next 等上层框架。

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

快捷键：
- `空格`：播放 / 暂停
- `←` / `→`：切换章节

## 构建命令

```bash
npm run build
```

构建产物输出到 `dist/` 目录。可使用：

```bash
npm run preview
```

在本地预览构建产物。

## 部署到 Cloudflare Pages

1. 将项目推送到 GitHub 仓库。
2. 在 Cloudflare Dashboard 进入 **Workers & Pages → Create → Pages → Connect to Git**，授权并选择该仓库。
3. 配置构建设置：
   - **Framework preset**：`None`（或 `Vite`）
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
   - **Root directory**：保持空（若项目在根目录）
4. 点击 **Save and Deploy**，等待首次构建完成即可获得 `*.pages.dev` 预览地址。

后续每次 `git push`，Cloudflare Pages 会自动触发新一次构建与发布。

## 目录结构

```
project-root/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── README.md
├── public/                # 静态资源（保留占位，可按需放入 favicon 等）
└── src/
    ├── main.ts            # 浏览器入口，挂载 UI、绑定快捷键
    ├── app.ts             # 应用主类，串联 stage、timeline、UI、scenes
    ├── styles/
    │   └── global.css     # 页面样式（顶栏、画布容器、字幕、导航、控制条）
    ├── core/
    │   ├── stage.ts       # PIXI Application 创建 / 背景 / 画布缩放
    │   ├── timeline.ts    # GSAP 主时间轴 + 章节标签管理
    │   ├── palette.ts     # 统一色板、风格参数与旁白文本常量
    │   └── types.ts       # 共享 TypeScript 类型（Scene / ChapterInfo 等）
    ├── ui/
    │   ├── controls.ts    # 播放 / 暂停 / 重播 / 章节跳转按钮 + 进度条
    │   ├── chapterNav.ts  # 章节导航条
    │   └── captions.ts    # 底部字幕说明区
    ├── entities/
    │   ├── virus.ts       # 病原体
    │   ├── antigen.ts     # 抗原（片段）
    │   ├── bCell.ts       # B 细胞
    │   ├── helperTCell.ts # 辅助性 T 细胞
    │   ├── killerTCell.ts # 细胞毒性 T 细胞
    │   ├── plasmaCell.ts  # 浆细胞
    │   ├── memoryCell.ts  # 记忆 B / T 细胞
    │   ├── dendriticCell.ts # 树突状细胞
    │   ├── macrophage.ts  # 巨噬细胞
    │   ├── infectedCell.ts # 被感染的宿主细胞（靶细胞）
    │   ├── antibody.ts    # 抗体（Y 形结构）
    │   ├── cytokine.ts    # 细胞因子
    │   └── labels.ts      # 标签胶囊与章节大标题
    ├── scenes/
    │   ├── introScene.ts
    │   ├── antigenPresentationScene.ts
    │   ├── humoralImmunityScene.ts
    │   ├── cellularImmunityScene.ts
    │   ├── memoryResponseScene.ts
    │   └── summaryScene.ts
    └── utils/
        ├── animation.ts   # 漂浮、膜波动、淡入淡出、高亮脉冲等
        ├── layout.ts      # 16:9 设计坐标 / 栅格 / 圆环布点
        ├── easing.ts      # 缓动常量（power2、back、elastic 等）
        └── text.ts        # PIXI Text 构造助手
```

## 可扩展

- 在 `src/scenes/` 下新增 Scene 类并实现 `build(ctx, tl)`，然后在 `src/app.ts` 中加入 `scenes` 数组即可。
- 所有颜色、字体、旁白文案集中在 `src/core/palette.ts`，便于调整视觉与教学文案。
- 实体绘制集中在 `src/entities/*`，可独立替换样式、添加纹理或替换为 SVG / Lottie。

## 授权

仅用于课堂教学与教学展示用途。
