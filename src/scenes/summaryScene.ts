import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTag } from '../entities/labels';
import { createBCell } from '../entities/bCell';
import { createPlasmaCell } from '../entities/plasmaCell';
import { createHelperTCell } from '../entities/helperTCell';
import { createKillerTCell } from '../entities/killerTCell';
import { createInfectedCell } from '../entities/infectedCell';
import { createAntibody } from '../entities/antibody';
import { createVirus } from '../entities/virus';
import { createDendriticCell } from '../entities/dendriticCell';
import { createMacrophage } from '../entities/macrophage';
import { makeText } from '../utils/text';
import { EASE } from '../utils/easing';
import { membranePulse } from '../utils/animation';

export class SummaryScene implements Scene {
  readonly chapter: ChapterInfo = {
    id: 'summary',
    index: 6,
    title: '体液免疫与细胞免疫协同总结',
    subtitle: 'Synergy & Homeostasis'
  };

  private root = new Container();
  private disposers: Array<() => void> = [];

  build(ctx: SceneContext, tl: gsap.core.Timeline): void {
    const { stage, width, height } = ctx;
    stage.addChild(this.root);
    this.root.alpha = 0;

    const title = makeChapterTitle(this.chapter.title, this.chapter.subtitle ?? '');
    title.position.set(width / 2, 82);
    title.scale.set(0.7);
    title.alpha = 0;
    this.root.addChild(title);

    // 左右两个分区 —— 体液免疫 / 细胞免疫
    const leftCx = width * 0.28;
    const rightCx = width * 0.72;
    const midY = height * 0.5;

    const leftBg = new Graphics();
    leftBg.beginFill(PALETTE.blueSoft, 0.22);
    leftBg.drawRoundedRect(width * 0.06, height * 0.2, width * 0.42, height * 0.65, 22);
    leftBg.endFill();
    leftBg.alpha = 0;
    this.root.addChild(leftBg);

    const rightBg = new Graphics();
    rightBg.beginFill(PALETTE.tealSoft, 0.22);
    rightBg.drawRoundedRect(width * 0.52, height * 0.2, width * 0.42, height * 0.65, 22);
    rightBg.endFill();
    rightBg.alpha = 0;
    this.root.addChild(rightBg);

    const leftTitle = makeText('体液免疫 · 抗体中和游离病原体', {
      fontSize: 18,
      color: PALETTE.inkSoft,
      weight: '600'
    });
    leftTitle.position.set(leftCx, height * 0.24);
    leftTitle.alpha = 0;

    const rightTitle = makeText('细胞免疫 · 清除被感染的宿主细胞', {
      fontSize: 18,
      color: PALETTE.inkSoft,
      weight: '600'
    });
    rightTitle.position.set(rightCx, height * 0.24);
    rightTitle.alpha = 0;
    this.root.addChild(leftTitle, rightTitle);

    // 左侧：B → 浆细胞 → 抗体 → 游离病原体
    const bCell = createBCell({ radius: 36 });
    bCell.position.set(leftCx - 110, midY - 40);
    const plasma = createPlasmaCell(38);
    plasma.position.set(leftCx - 30, midY + 10);
    const abGroup: Container[] = [];
    for (let i = 0; i < 6; i++) {
      const ab = createAntibody(0.7);
      ab.position.set(leftCx + 40 + (i % 3) * 22, midY - 20 + Math.floor(i / 3) * 30);
      abGroup.push(ab);
      this.root.addChild(ab);
      ab.alpha = 0;
    }
    const leftVirus = createVirus({ radius: 18 });
    leftVirus.position.set(leftCx + 118, midY + 40);
    [bCell, plasma, leftVirus].forEach((e) => {
      e.alpha = 0;
      this.root.addChild(e);
      this.disposers.push(() => membranePulse(e, 0.02, 3.5).kill());
    });

    // 右侧：辅助T + 细胞毒性T → 感染细胞
    const helperT = createHelperTCell(34);
    helperT.position.set(rightCx - 110, midY - 40);
    const killerT = createKillerTCell(36);
    killerT.position.set(rightCx - 30, midY + 10);
    const infected = createInfectedCell(48, true);
    infected.position.set(rightCx + 80, midY + 20);
    [helperT, killerT, infected].forEach((e) => {
      e.alpha = 0;
      this.root.addChild(e);
      this.disposers.push(() => membranePulse(e, 0.02, 3.5).kill());
    });

    // 中部：辅助T细胞（关键协调）、吞噬细胞（桥梁）
    const centerHelper = createHelperTCell(42);
    centerHelper.position.set(width / 2, height * 0.3);
    const centerMacro = createMacrophage(52);
    centerMacro.position.set(width / 2, height * 0.75);
    const centerDendritic = createDendriticCell(44);
    centerDendritic.position.set(width / 2, height * 0.58);
    [centerHelper, centerDendritic, centerMacro].forEach((e) => {
      e.alpha = 0;
      this.root.addChild(e);
      this.disposers.push(() => membranePulse(e, 0.025, 3.5).kill());
    });

    // 标签
    const centerHelperTag = makeTag('辅助性 T 细胞 · 协调', { fontSize: 12 });
    centerHelperTag.position.set(width / 2, height * 0.3 - 70);
    centerHelperTag.alpha = 0;
    const centerDendriticTag = makeTag('抗原呈递细胞', { fontSize: 12 });
    centerDendriticTag.position.set(width / 2, height * 0.58 - 70);
    centerDendriticTag.alpha = 0;
    const centerMacroTag = makeTag('吞噬清除', { fontSize: 12 });
    centerMacroTag.position.set(width / 2, height * 0.75 + 72);
    centerMacroTag.alpha = 0;
    this.root.addChild(centerHelperTag, centerDendriticTag, centerMacroTag);

    // 连接线（柔和）
    const links = new Graphics();
    links.alpha = 0;
    this.root.addChild(links);

    const drawLinks = () => {
      links.clear();
      links.lineStyle(1.5, PALETTE.inkMuted, 0.35);
      // 辅助T → 左 & 右
      curve(links, centerHelper.position.x, centerHelper.position.y + 36, bCell.position.x, bCell.position.y - 20);
      curve(links, centerHelper.position.x, centerHelper.position.y + 36, helperT.position.x, helperT.position.y - 20);
      // 抗原呈递细胞 → 左 & 右
      curve(links, centerDendritic.position.x, centerDendritic.position.y, bCell.position.x + 14, bCell.position.y);
      curve(links, centerDendritic.position.x, centerDendritic.position.y, helperT.position.x - 14, helperT.position.y);
      // 吞噬清除 ← 两侧
      curve(links, leftVirus.position.x, leftVirus.position.y + 20, centerMacro.position.x, centerMacro.position.y - 20);
      curve(links, infected.position.x, infected.position.y + 20, centerMacro.position.x, centerMacro.position.y - 20);
    };

    // 底部总结文字
    const bottomLine = makeText(
      '体液免疫 · 细胞免疫 · 吞噬清除 —— 巧妙配合，共同维持机体内环境稳态',
      { fontSize: 16, color: PALETTE.ink, weight: '500', letterSpacing: 1 }
    );
    bottomLine.position.set(width / 2, height * 0.92);
    bottomLine.alpha = 0;
    this.root.addChild(bottomLine);

    // 时间轴
    tl.to(this.root, { alpha: 1, duration: 0.6 });
    tl.to(title, { alpha: 1, duration: 0.6 }, '<');
    tl.to([leftBg, rightBg, leftTitle, rightTitle], { alpha: 1, duration: 0.6, stagger: 0.1 }, '+=0.2');

    tl.call(() => ctx.setCaption(NARRATION.summary));

    tl.to([bCell, plasma, leftVirus], { alpha: 1, duration: 0.5, stagger: 0.12 }, '+=0.2');
    tl.to([helperT, killerT, infected], { alpha: 1, duration: 0.5, stagger: 0.12 }, '<');

    tl.to([centerHelper, centerDendritic, centerMacro], { alpha: 1, duration: 0.6, stagger: 0.12 }, '+=0.1');
    tl.to([centerHelperTag, centerDendriticTag, centerMacroTag], { alpha: 1, duration: 0.5, stagger: 0.1 }, '<');

    tl.add(() => drawLinks());
    tl.to(links, { alpha: 1, duration: 0.8 }, '+=0.05');

    // 左侧抗体飞向游离病原体
    abGroup.forEach((ab, i) => {
      const ang = (i / abGroup.length) * Math.PI * 2;
      const tx = leftVirus.position.x + Math.cos(ang) * 32;
      const ty = leftVirus.position.y + Math.sin(ang) * 32;
      tl.to(ab, { alpha: 1, duration: 0.25 }, i === 0 ? '+=0.1' : '<');
      tl.to(ab.position, { x: tx, y: ty, duration: 1.2, ease: EASE.softInOut }, '<');
    });

    // 右侧：细胞毒性 T 靠近感染细胞
    tl.to(killerT.position, {
      x: infected.position.x - 58,
      y: infected.position.y + 6,
      duration: 1.2,
      ease: EASE.softInOut
    }, '-=1.0');

    // 最终文字亮起
    tl.to(bottomLine, { alpha: 1, duration: 0.8 }, '+=0.3');
    tl.to({}, { duration: 1.2 });
    tl.call(() => ctx.clearCaption());
    tl.to(this.root, { alpha: 0, duration: 0.8 });
  }

  dispose(): void {
    this.disposers.forEach((d) => d());
    this.root.destroy({ children: true });
  }
}

function curve(
  g: Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + 10;
  g.moveTo(x1, y1);
  for (let t = 0; t <= 1; t += 0.04) {
    const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    g.lineTo(px, py);
  }
}
