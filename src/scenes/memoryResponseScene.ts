import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTagWithPin } from '../entities/labels';
import { createMemoryCell } from '../entities/memoryCell';
import { createPlasmaCell } from '../entities/plasmaCell';
import { createKillerTCell } from '../entities/killerTCell';
import { createAntibody } from '../entities/antibody';
import { createVirus } from '../entities/virus';
import { makeText } from '../utils/text';
import { EASE } from '../utils/easing';
import { membranePulse, highlightPulse } from '../utils/animation';

export class MemoryResponseScene implements Scene {
  readonly chapter: ChapterInfo = {
    id: 'memory',
    index: 5,
    title: '记忆细胞与二次免疫应答',
    subtitle: 'Memory Cells & Secondary Response'
  };

  private root = new Container();
  private disposers: Array<() => void> = [];

  build(ctx: SceneContext, tl: gsap.core.Timeline): void {
    const { stage, width, height } = ctx;
    stage.addChild(this.root);
    this.root.alpha = 0;

    const title = makeChapterTitle(this.chapter.title, this.chapter.subtitle ?? '');
    title.position.set(width / 2, 90);
    title.scale.set(0.7);
    title.alpha = 0;
    this.root.addChild(title);

    // 左：首次应答（较慢），右：二次应答（更快更强）
    const leftCx = width * 0.28;
    const rightCx = width * 0.72;
    const topY = height * 0.25;

    const labelFirst = makeText('首次应答', { fontSize: 18, color: PALETTE.inkSoft, weight: '600' });
    labelFirst.position.set(leftCx, topY - 40);
    labelFirst.alpha = 0;
    const labelSecond = makeText('二次应答 · 更快更强', { fontSize: 18, color: PALETTE.inkSoft, weight: '600' });
    labelSecond.position.set(rightCx, topY - 40);
    labelSecond.alpha = 0;
    this.root.addChild(labelFirst, labelSecond);

    // 中间分隔
    const divider = new Graphics();
    divider.lineStyle(1, PALETTE.labelBorder, 0.8);
    divider.moveTo(width / 2, topY - 20);
    divider.lineTo(width / 2, height * 0.9);
    divider.alpha = 0;
    this.root.addChild(divider);

    // 记忆 B / T 细胞（左右各一）
    const memoryBLeft = createMemoryCell('B', 38);
    memoryBLeft.position.set(leftCx - 80, height * 0.42);
    memoryBLeft.alpha = 0;
    this.root.addChild(memoryBLeft);
    this.disposers.push(() => membranePulse(memoryBLeft, 0.02, 3.2).kill());

    const memoryTLeft = createMemoryCell('T', 38);
    memoryTLeft.position.set(leftCx + 80, height * 0.42);
    memoryTLeft.alpha = 0;
    this.root.addChild(memoryTLeft);
    this.disposers.push(() => membranePulse(memoryTLeft, 0.02, 3.2).kill());

    const memoryBRight = createMemoryCell('B', 38);
    memoryBRight.position.set(rightCx - 80, height * 0.42);
    memoryBRight.alpha = 0;
    this.root.addChild(memoryBRight);
    this.disposers.push(() => membranePulse(memoryBRight, 0.02, 3.2).kill());

    const memoryTRight = createMemoryCell('T', 38);
    memoryTRight.position.set(rightCx + 80, height * 0.42);
    memoryTRight.alpha = 0;
    this.root.addChild(memoryTRight);
    this.disposers.push(() => membranePulse(memoryTRight, 0.02, 3.2).kill());

    // 左右分别的抗原入侵
    const virusLeft = createVirus({ radius: 18 });
    virusLeft.position.set(leftCx, height * 0.75);
    virusLeft.alpha = 0;
    this.root.addChild(virusLeft);
    const virusRight = createVirus({ radius: 18 });
    virusRight.position.set(rightCx, height * 0.75);
    virusRight.alpha = 0;
    this.root.addChild(virusRight);

    // 响应曲线（示意，简洁柔和）
    const curveHost = new Container();
    curveHost.alpha = 0;
    this.root.addChild(curveHost);

    // 时间轴
    tl.to(this.root, { alpha: 1, duration: 0.6 });
    tl.to(title, { alpha: 1, duration: 0.6 }, '<');
    tl.to([labelFirst, labelSecond, divider], { alpha: 1, duration: 0.6, stagger: 0.1 }, '<');

    tl.call(() => ctx.setCaption(NARRATION.memory));

    tl.to([memoryBLeft, memoryTLeft, memoryBRight, memoryTRight], {
      alpha: 1, duration: 0.6, stagger: 0.1
    }, '+=0.2');

    tl.to([virusLeft, virusRight], { alpha: 1, duration: 0.5 }, '+=0.2');

    // 左侧：首次应答较慢 —— 先有延迟，然后分化 & 产生少量抗体 / 少量杀伤
    tl.add(highlightPulse(memoryBLeft, 1, 0.6), '+=0.4');
    tl.add(highlightPulse(memoryTLeft, 1, 0.6), '<');

    const leftPlasma = createPlasmaCell(38);
    leftPlasma.position.copyFrom(memoryBLeft.position);
    leftPlasma.scale.set(0.5);
    leftPlasma.alpha = 0;
    this.root.addChild(leftPlasma);
    const leftKiller = createKillerTCell(38);
    leftKiller.position.copyFrom(memoryTLeft.position);
    leftKiller.scale.set(0.5);
    leftKiller.alpha = 0;
    this.root.addChild(leftKiller);

    tl.to([leftPlasma, leftKiller], { alpha: 1, duration: 0.6 }, '+=0.4');
    tl.to([leftPlasma.scale, leftKiller.scale], { x: 1, y: 1, duration: 0.8, ease: EASE.pop }, '<');
    tl.to(leftPlasma.position, { x: leftCx - 40, y: height * 0.55, duration: 0.6, ease: EASE.softInOut }, '<');
    tl.to(leftKiller.position, { x: leftCx + 40, y: height * 0.55, duration: 0.6, ease: EASE.softInOut }, '<');

    // 少量抗体出现
    const leftAbs: Container[] = [];
    for (let i = 0; i < 4; i++) {
      const ab = createAntibody(0.7);
      ab.position.copyFrom(leftPlasma.position);
      ab.alpha = 0;
      this.root.addChild(ab);
      leftAbs.push(ab);
    }
    leftAbs.forEach((ab, i) => {
      const ang = (i / leftAbs.length) * Math.PI * 2;
      const tx = virusLeft.position.x + Math.cos(ang) * 40;
      const ty = virusLeft.position.y + Math.sin(ang) * 40;
      tl.to(ab, { alpha: 1, duration: 0.3 }, i === 0 ? '+=0.2' : '<');
      tl.to(ab.position, { x: tx, y: ty, duration: 1.4, ease: EASE.softInOut }, '<');
    });

    tl.to(virusLeft, { alpha: 0.3, duration: 0.6 }, '+=0.2');

    // 右侧：二次应答 —— 反应迅速、大量增殖、大量抗体
    tl.add(highlightPulse(memoryBRight, 2, 0.4), '-=1.8');
    tl.add(highlightPulse(memoryTRight, 2, 0.4), '<');

    const rightPlasmas: Container[] = [];
    for (let i = 0; i < 3; i++) {
      const p = createPlasmaCell(38);
      p.position.copyFrom(memoryBRight.position);
      p.scale.set(0.4);
      p.alpha = 0;
      this.root.addChild(p);
      rightPlasmas.push(p);
    }
    const rightKillers: Container[] = [];
    for (let i = 0; i < 3; i++) {
      const k = createKillerTCell(36);
      k.position.copyFrom(memoryTRight.position);
      k.scale.set(0.4);
      k.alpha = 0;
      this.root.addChild(k);
      rightKillers.push(k);
    }

    tl.to([...rightPlasmas, ...rightKillers], { alpha: 1, duration: 0.35, stagger: 0.05 }, '<');
    rightPlasmas.forEach((p, i) => {
      const x = rightCx - 80 + i * 40;
      const y = height * 0.55;
      tl.to(p.scale, { x: 1, y: 1, duration: 0.5, ease: EASE.pop }, '<');
      tl.to(p.position, { x, y, duration: 0.5, ease: EASE.softInOut }, '<');
    });
    rightKillers.forEach((k, i) => {
      const x = rightCx + 40 + i * 40;
      const y = height * 0.6;
      tl.to(k.scale, { x: 1, y: 1, duration: 0.5, ease: EASE.pop }, '<');
      tl.to(k.position, { x, y, duration: 0.5, ease: EASE.softInOut }, '<');
    });

    // 大量抗体瞬间涌向右侧病原体
    const rightAbs: Container[] = [];
    for (let i = 0; i < 12; i++) {
      const ab = createAntibody(0.75);
      ab.position.set(rightPlasmas[i % rightPlasmas.length].position.x, rightPlasmas[i % rightPlasmas.length].position.y);
      ab.alpha = 0;
      this.root.addChild(ab);
      rightAbs.push(ab);
    }
    rightAbs.forEach((ab, i) => {
      const ang = (i / rightAbs.length) * Math.PI * 2;
      const tx = virusRight.position.x + Math.cos(ang) * 46;
      const ty = virusRight.position.y + Math.sin(ang) * 46;
      tl.to(ab, { alpha: 1, duration: 0.18 }, i === 0 ? '+=0.1' : '<');
      tl.to(ab.position, { x: tx, y: ty, duration: 0.8, ease: EASE.softInOut }, '<');
    });

    tl.add(highlightPulse(virusRight, 1, 0.5), '-=0.2');
    tl.to(virusRight, { alpha: 0.15, duration: 0.4 }, '+=0.1');

    // 简洁的响应曲线示意（右侧比左侧更陡更高）
    const axes = new Graphics();
    axes.lineStyle(1, PALETTE.labelBorder, 1);
    const ax = width * 0.18, ay = height * 0.88, aw = width * 0.64, ah = 90;
    axes.moveTo(ax, ay);
    axes.lineTo(ax + aw, ay);
    axes.moveTo(ax, ay);
    axes.lineTo(ax, ay - ah);
    curveHost.addChild(axes);

    const curve1 = new Graphics();
    curve1.lineStyle(2.5, PALETTE.blue, 0.85);
    curve1.moveTo(ax, ay);
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = ax + aw * 0.1 + t * aw * 0.35;
      const y = ay - Math.pow(t, 1.4) * ah * 0.55;
      curve1.lineTo(x, y);
    }
    curveHost.addChild(curve1);

    const curve2 = new Graphics();
    curve2.lineStyle(2.5, PALETTE.coral, 0.9);
    curve2.moveTo(ax, ay);
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = ax + aw * 0.52 + t * aw * 0.3;
      const y = ay - Math.pow(t, 0.7) * ah * 0.95;
      curve2.lineTo(x, y);
    }
    curveHost.addChild(curve2);

    const cap1 = makeText('首次应答', { fontSize: 12, color: PALETTE.blue });
    cap1.position.set(ax + aw * 0.3, ay - ah * 0.5 - 16);
    const cap2 = makeText('二次应答', { fontSize: 12, color: PALETTE.coral });
    cap2.position.set(ax + aw * 0.78, ay - ah * 0.9 - 16);
    curveHost.addChild(cap1, cap2);

    tl.to(curveHost, { alpha: 1, duration: 0.6 }, '+=0.1');

    tl.to({}, { duration: 0.8 });
    tl.call(() => ctx.clearCaption());
    tl.to(this.root, { alpha: 0, duration: 0.6 });
  }

  dispose(): void {
    this.disposers.forEach((d) => d());
    this.root.destroy({ children: true });
  }
}
