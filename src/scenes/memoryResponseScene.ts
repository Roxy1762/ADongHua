import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTagWithPin } from '../entities/labels';
import { createBCell } from '../entities/bCell';
import { createHelperTCell } from '../entities/helperTCell';
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

    // 左：首次应答中心 x；右：二次应答中心 x
    const leftCx = width * 0.27;
    const rightCx = width * 0.73;
    const cellY = height * 0.47;

    // 标题标签
    const labelFirst = makeText('首次免疫应答', {
      fontSize: 18, color: PALETTE.inkSoft, weight: '600'
    });
    labelFirst.position.set(leftCx, height * 0.19);
    labelFirst.alpha = 0;
    this.root.addChild(labelFirst);

    const subFirst = makeText('初始淋巴细胞缓慢激活  ·  7–14 天达峰', {
      fontSize: 13, color: PALETTE.inkMuted
    });
    subFirst.position.set(leftCx, height * 0.19 + 26);
    subFirst.alpha = 0;
    this.root.addChild(subFirst);

    const labelSecond = makeText('再次遭遇同种抗原', {
      fontSize: 18, color: PALETTE.coral, weight: '600'
    });
    labelSecond.position.set(rightCx, height * 0.19);
    labelSecond.alpha = 0;
    this.root.addChild(labelSecond);

    const subSecond = makeText('记忆细胞迅速响应  ·  1–3 天即达高峰', {
      fontSize: 13, color: PALETTE.coral
    });
    subSecond.position.set(rightCx, height * 0.19 + 26);
    subSecond.alpha = 0;
    this.root.addChild(subSecond);

    // 中间分隔线
    const divider = new Graphics();
    divider.lineStyle(1, PALETTE.labelBorder, 0.9);
    divider.moveTo(width / 2, height * 0.14);
    divider.lineTo(width / 2, height * 0.88);
    divider.alpha = 0;
    this.root.addChild(divider);

    // ── 左侧（首次应答）：初始淋巴细胞 ──────────────────────────
    // 初始 B 细胞（naive B cell）
    const naiveB = createBCell({ radius: 40 });
    naiveB.position.set(leftCx - 76, cellY);
    naiveB.alpha = 0;
    this.root.addChild(naiveB);
    this.disposers.push(() => membranePulse(naiveB, 0.02, 3.5).kill());

    const tagNaiveB = makeTagWithPin('初始 B 细胞', 0);
    tagNaiveB.position.set(leftCx - 76, cellY + 86);
    tagNaiveB.alpha = 0;
    this.root.addChild(tagNaiveB);

    // 初始 T 细胞（naive T cell）
    const naiveT = createHelperTCell(38);
    naiveT.position.set(leftCx + 76, cellY);
    naiveT.alpha = 0;
    this.root.addChild(naiveT);
    this.disposers.push(() => membranePulse(naiveT, 0.02, 3.2).kill());

    const tagNaiveT = makeTagWithPin('初始 T 细胞', 0);
    tagNaiveT.position.set(leftCx + 76, cellY + 78);
    tagNaiveT.alpha = 0;
    this.root.addChild(tagNaiveT);

    // 左侧病毒
    const virusLeft = createVirus({ radius: 18 });
    virusLeft.position.set(leftCx, height * 0.73);
    virusLeft.alpha = 0;
    this.root.addChild(virusLeft);

    // 首次应答产物：浆细胞 + 新生记忆细胞
    const leftPlasma = createPlasmaCell(40);
    leftPlasma.position.set(leftCx - 62, cellY - 88);
    leftPlasma.scale.set(0.3);
    leftPlasma.alpha = 0;
    this.root.addChild(leftPlasma);
    this.disposers.push(() => membranePulse(leftPlasma, 0.02, 3).kill());

    const tagLeftPlasma = makeTagWithPin('浆细胞（分化产物）', 0);
    tagLeftPlasma.position.set(leftCx - 62, cellY - 88 - 66);
    tagLeftPlasma.alpha = 0;
    this.root.addChild(tagLeftPlasma);

    const leftMemB = createMemoryCell('B', 32);
    leftMemB.position.set(leftCx + 30, cellY - 94);
    leftMemB.scale.set(0.3);
    leftMemB.alpha = 0;
    this.root.addChild(leftMemB);
    this.disposers.push(() => membranePulse(leftMemB, 0.02, 3.5).kill());

    const leftMemT = createMemoryCell('T', 30);
    leftMemT.position.set(leftCx + 110, cellY - 78);
    leftMemT.scale.set(0.3);
    leftMemT.alpha = 0;
    this.root.addChild(leftMemT);
    this.disposers.push(() => membranePulse(leftMemT, 0.02, 3.5).kill());

    const tagLeftMem = makeTagWithPin('记忆细胞（首次应答中形成）', 0);
    tagLeftMem.position.set(leftCx + 70, cellY - 94 - 64);
    tagLeftMem.alpha = 0;
    this.root.addChild(tagLeftMem);

    // ── 右侧（二次应答）：已存在的记忆细胞 ─────────────────────
    const memBRight = createMemoryCell('B', 40);
    memBRight.position.set(rightCx - 76, cellY);
    memBRight.alpha = 0;
    this.root.addChild(memBRight);
    this.disposers.push(() => membranePulse(memBRight, 0.02, 3.2).kill());

    const tagMemBRight = makeTagWithPin('记忆 B 细胞', 0);
    tagMemBRight.position.set(rightCx - 76, cellY + 82);
    tagMemBRight.alpha = 0;
    this.root.addChild(tagMemBRight);

    const memTRight = createMemoryCell('T', 40);
    memTRight.position.set(rightCx + 76, cellY);
    memTRight.alpha = 0;
    this.root.addChild(memTRight);
    this.disposers.push(() => membranePulse(memTRight, 0.02, 3.2).kill());

    const tagMemTRight = makeTagWithPin('记忆 T 细胞', 0);
    tagMemTRight.position.set(rightCx + 76, cellY + 82);
    tagMemTRight.alpha = 0;
    this.root.addChild(tagMemTRight);

    // 右侧病毒
    const virusRight = createVirus({ radius: 18 });
    virusRight.position.set(rightCx, height * 0.73);
    virusRight.alpha = 0;
    this.root.addChild(virusRight);

    // 二次应答产物：大量浆细胞 + 杀伤T细胞
    const rightPlasmas: Container[] = [];
    const pxOffsets = [-108, -52, 4, 60];
    const pyOffsets = [0, -22, -22, 0];
    pxOffsets.forEach((dx, i) => {
      const p = createPlasmaCell(36);
      p.position.set(rightCx + dx, cellY - 86 + pyOffsets[i]);
      p.scale.set(0.3);
      p.alpha = 0;
      this.root.addChild(p);
      rightPlasmas.push(p);
      this.disposers.push(() => membranePulse(p, 0.02, 2.8).kill());
    });

    const rightKillers: Container[] = [];
    [[110, -60], [158, -36]].forEach(([dx, dy]) => {
      const k = createKillerTCell(34);
      k.position.set(rightCx + dx, cellY + dy);
      k.scale.set(0.3);
      k.alpha = 0;
      this.root.addChild(k);
      rightKillers.push(k);
    });

    // ── 响应曲线（抗体效价示意）──────────────────────────────────
    const curveHost = new Container();
    curveHost.alpha = 0;
    this.root.addChild(curveHost);

    const ax = width * 0.09;
    const ay = height * 0.88;
    const aw = width * 0.82;
    const ah = 84;

    // 坐标轴
    const axes = new Graphics();
    axes.lineStyle(1.2, PALETTE.labelBorder, 1);
    axes.moveTo(ax, ay - ah - 12);
    axes.lineTo(ax, ay);
    axes.lineTo(ax + aw, ay);
    curveHost.addChild(axes);

    // 两次抗原刻度
    const mkTick = (fracX: number) => {
      const g = new Graphics();
      g.lineStyle(1, PALETTE.labelBorder, 0.75);
      g.moveTo(ax + aw * fracX, ay);
      g.lineTo(ax + aw * fracX, ay + 5);
      return g;
    };
    curveHost.addChild(mkTick(0.20), mkTick(0.56));

    const mkXCap = (text: string, fracX: number) => {
      const t = makeText(text, { fontSize: 11, color: PALETTE.inkMuted });
      t.position.set(ax + aw * fracX, ay + 15);
      return t;
    };
    curveHost.addChild(
      mkXCap('第一次抗原入侵', 0.20),
      mkXCap('第二次抗原入侵', 0.56)
    );

    const xAxisLabel = makeText('时间 / 天', { fontSize: 12, color: PALETTE.inkMuted });
    xAxisLabel.position.set(ax + aw + 28, ay);
    curveHost.addChild(xAxisLabel);

    const yAxisLabel = makeText('抗体效价', { fontSize: 11, color: PALETTE.inkMuted });
    yAxisLabel.position.set(ax - 28, ay - ah / 2);
    curveHost.addChild(yAxisLabel);

    // 首次应答曲线（低且慢，对称钟形）
    const curve1 = new Graphics();
    curve1.lineStyle(2.5, PALETTE.blue, 0.85);
    curve1.moveTo(ax + aw * 0.20, ay);
    const c1span = aw * 0.30;
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = ax + aw * 0.20 + t * c1span;
      const y = ay - Math.sin(t * Math.PI) * ah * 0.50;
      curve1.lineTo(x, y);
    }
    curveHost.addChild(curve1);

    // 二次应答曲线（高且快，快速上升慢速下降）
    const curve2 = new Graphics();
    curve2.lineStyle(2.5, PALETTE.coral, 0.9);
    curve2.moveTo(ax + aw * 0.56, ay);
    const c2span = aw * 0.30;
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = ax + aw * 0.56 + t * c2span;
      const peak = t <= 0.28
        ? (t / 0.28) * ah * 0.96
        : Math.max(0, (1 - t) / 0.72) * ah * 0.96;
      const y = ay - peak;
      curve2.lineTo(x, y);
    }
    curveHost.addChild(curve2);

    // 曲线图例
    const cap1 = makeText('首次应答（量少·慢）', { fontSize: 12, color: PALETTE.blue });
    cap1.position.set(ax + aw * 0.34, ay - ah * 0.46 - 16);
    const cap2 = makeText('二次应答（量多·快）', { fontSize: 12, color: PALETTE.coral });
    cap2.position.set(ax + aw * 0.72, ay - ah * 0.92 - 16);
    curveHost.addChild(cap1, cap2);

    // ════════════════ 时间轴 ════════════════
    tl.to(this.root, { alpha: 1, duration: 0.6 });
    tl.to(title, { alpha: 1, duration: 0.6 }, '<');
    tl.to([labelFirst, subFirst, divider], { alpha: 1, duration: 0.5, stagger: 0.1 }, '<');
    tl.call(() => ctx.setCaption(NARRATION.memory));

    // 初始淋巴细胞登场
    tl.to([naiveB, naiveT], { alpha: 1, duration: 0.5, stagger: 0.12 }, '+=0.2');
    tl.to([tagNaiveB, tagNaiveT], { alpha: 1, duration: 0.5 }, '<');
    tl.to(virusLeft, { alpha: 1, duration: 0.4 }, '+=0.2');

    // ── 首次应答：刻意延迟，体现"缓慢" ──
    tl.to({}, { duration: 0.9 }); // 模拟初始激活潜伏期

    tl.add(highlightPulse(naiveB, 1, 0.9), '+=0.3');
    tl.add(highlightPulse(naiveT, 1, 0.9), '<');

    // 慢慢分化出浆细胞
    tl.to(leftPlasma, { alpha: 1, duration: 0.8 }, '+=0.7');
    tl.to(leftPlasma.scale, { x: 1, y: 1, duration: 1.4, ease: EASE.pop }, '<');
    tl.to(tagLeftPlasma, { alpha: 1, duration: 0.5 }, '-=0.6');

    // 同时形成记忆细胞
    tl.to([leftMemB, leftMemT], { alpha: 1, duration: 0.6, stagger: 0.18 }, '+=0.2');
    tl.to([leftMemB.scale, leftMemT.scale], { x: 1, y: 1, duration: 1.0, ease: EASE.pop }, '<');
    tl.to(tagLeftMem, { alpha: 1, duration: 0.4 }, '-=0.4');

    // 少量抗体缓慢飞向病原体
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
      const tx = virusLeft.position.x + Math.cos(ang) * 38;
      const ty = virusLeft.position.y + Math.sin(ang) * 38;
      tl.to(ab, { alpha: 1, duration: 0.4 }, i === 0 ? '+=0.4' : '<');
      tl.to(ab.position, { x: tx, y: ty, duration: 2.0, ease: EASE.softInOut }, '<');
    });

    tl.to(virusLeft, { alpha: 0.32, duration: 0.9 }, '+=0.5');

    // ── 二次应答：在首次之后才开始 ──
    tl.addLabel('secondary', '+=0.8');
    tl.to([labelSecond, subSecond], { alpha: 1, duration: 0.4, stagger: 0.08 }, 'secondary');

    tl.to([memBRight, memTRight], { alpha: 1, duration: 0.4, stagger: 0.08 }, 'secondary+=0.15');
    tl.to([tagMemBRight, tagMemTRight], { alpha: 1, duration: 0.4 }, '<');
    tl.to(virusRight, { alpha: 1, duration: 0.3 }, '+=0.1');

    // 记忆细胞迅速激活
    tl.add(highlightPulse(memBRight, 2, 0.32), '+=0.12');
    tl.add(highlightPulse(memTRight, 2, 0.32), '<');

    // 大量快速增殖
    tl.to([...rightPlasmas, ...rightKillers], {
      alpha: 1, duration: 0.22, stagger: 0.04
    }, '+=0.08');
    rightPlasmas.forEach((p) => {
      tl.to(p.scale, { x: 1, y: 1, duration: 0.40, ease: EASE.pop }, '<');
    });
    rightKillers.forEach((k) => {
      tl.to(k.scale, { x: 1, y: 1, duration: 0.40, ease: EASE.pop }, '<');
    });

    // 大量抗体迅速涌向病原体
    const rightAbs: Container[] = [];
    for (let i = 0; i < 14; i++) {
      const ab = createAntibody(0.76);
      const src = rightPlasmas[i % rightPlasmas.length];
      ab.position.set(src.position.x, src.position.y);
      ab.alpha = 0;
      this.root.addChild(ab);
      rightAbs.push(ab);
    }
    rightAbs.forEach((ab, i) => {
      const ang = (i / rightAbs.length) * Math.PI * 2;
      const tx = virusRight.position.x + Math.cos(ang) * 44;
      const ty = virusRight.position.y + Math.sin(ang) * 44;
      tl.to(ab, { alpha: 1, duration: 0.14 }, i === 0 ? '+=0.1' : '<');
      tl.to(ab.position, { x: tx, y: ty, duration: 0.65, ease: EASE.softInOut }, '<');
    });

    tl.add(highlightPulse(virusRight, 1, 0.4), '-=0.1');
    tl.to(virusRight, { alpha: 0.1, duration: 0.4 }, '+=0.05');

    // 响应曲线
    tl.to(curveHost, { alpha: 1, duration: 0.6 }, '+=0.2');

    tl.to({}, { duration: 0.8 });
    tl.call(() => ctx.clearCaption());
    tl.to(this.root, { alpha: 0, duration: 0.6 });
  }

  dispose(): void {
    this.disposers.forEach((d) => d());
    this.root.destroy({ children: true });
  }
}
