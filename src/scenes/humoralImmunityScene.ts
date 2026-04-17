import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTag, makeTagWithPin } from '../entities/labels';
import { createBCell } from '../entities/bCell';
import { createHelperTCell } from '../entities/helperTCell';
import { createPlasmaCell } from '../entities/plasmaCell';
import { createMemoryCell } from '../entities/memoryCell';
import { createAntibody } from '../entities/antibody';
import { createVirus } from '../entities/virus';
import { createAntigen } from '../entities/antigen';
import { createCytokine } from '../entities/cytokine';
import { EASE } from '../utils/easing';
import { membranePulse, highlightPulse } from '../utils/animation';

export class HumoralImmunityScene implements Scene {
  readonly chapter: ChapterInfo = {
    id: 'humoral',
    index: 3,
    title: '体液免疫过程',
    subtitle: 'Humoral Immunity'
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

    // B 细胞 + 抗原（信号1）
    const bCell = createBCell({ radius: 50 });
    bCell.position.set(width * 0.28, height * 0.45);
    bCell.alpha = 0;
    this.root.addChild(bCell);
    this.disposers.push(() => membranePulse(bCell, 0.02, 3).kill());

    const bTag = makeTagWithPin('B 细胞', 0);
    bTag.position.set(width * 0.28, height * 0.45 + 96);
    bTag.alpha = 0;
    this.root.addChild(bTag);

    // 游离抗原
    const antigens: Container[] = [];
    for (let i = 0; i < 5; i++) {
      const a = createAntigen(10);
      a.position.set(width * 0.1 + i * 12, height * 0.2 + ((i * 37) % 40));
      a.alpha = 0;
      this.root.addChild(a);
      antigens.push(a);
    }

    // 信号₁ 标签（抗原-BCR 结合）
    const signal1Label = makeTag('抗原-BCR 结合（信号₁）', {
      color: 0xeef5ff,
      textColor: PALETTE.blue,
      fontSize: 13
    });
    signal1Label.position.set(width * 0.28 - 110, height * 0.45 - 68);
    signal1Label.alpha = 0;
    this.root.addChild(signal1Label);

    // 辅助性 T 细胞（信号2）
    const helperT = createHelperTCell(44);
    helperT.position.set(width * 0.5, height * 0.7);
    helperT.alpha = 0;
    this.root.addChild(helperT);

    const helperTag = makeTagWithPin('辅助性 T 细胞', 0);
    helperTag.position.set(width * 0.5, height * 0.7 + 84);
    helperTag.alpha = 0;
    this.root.addChild(helperTag);

    // 信号₂ 标签（协同刺激）
    const signal2Label = makeTag('辅助性T细胞协同刺激（信号₂）', {
      color: 0xedf8f5,
      textColor: PALETTE.teal,
      fontSize: 13
    });
    signal2Label.position.set(width * 0.28 + 120, height * 0.45 - 68);
    signal2Label.alpha = 0;
    this.root.addChild(signal2Label);

    // 克隆扩增标签
    const expansionLabel = makeTag('克隆扩增', {
      color: 0xfff0f6,
      textColor: PALETTE.plasmaCore,
      fontSize: 15
    });
    expansionLabel.position.set(width * 0.64, height * 0.22);
    expansionLabel.alpha = 0;
    this.root.addChild(expansionLabel);

    // 三个浆细胞（体现克隆扩增）
    const plasma1 = createPlasmaCell(44);
    const plasma2 = createPlasmaCell(40);
    const plasma3 = createPlasmaCell(38);
    plasma1.position.set(width * 0.60, height * 0.33);
    plasma2.position.set(width * 0.64, height * 0.56);
    plasma3.position.set(width * 0.74, height * 0.40);
    [plasma1, plasma2, plasma3].forEach((e) => {
      e.alpha = 0;
      e.scale.set(0.55);
      this.root.addChild(e);
      this.disposers.push(() => membranePulse(e, 0.02, 3).kill());
    });

    const plasmaTag = makeTagWithPin('浆细胞（大量分泌抗体）', 0);
    plasmaTag.position.set(width * 0.64, height * 0.30 - 70);
    plasmaTag.alpha = 0;
    this.root.addChild(plasmaTag);

    // 记忆 B 细胞
    const memoryB = createMemoryCell('B', 38);
    memoryB.position.set(width * 0.85, height * 0.50);
    memoryB.alpha = 0;
    memoryB.scale.set(0.6);
    this.root.addChild(memoryB);
    this.disposers.push(() => membranePulse(memoryB, 0.02, 3).kill());

    const memoryTag = makeTagWithPin('记忆 B 细胞', 0);
    memoryTag.position.set(width * 0.85, height * 0.50 + 74);
    memoryTag.alpha = 0;
    this.root.addChild(memoryTag);

    // 抗体群
    const antibodies: Container[] = [];
    for (let i = 0; i < 12; i++) {
      const ab = createAntibody(0.9);
      ab.alpha = 0;
      this.root.addChild(ab);
      antibodies.push(ab);
    }

    // 游离病原体（抗体目标）
    const freeVirus = createVirus({ radius: 22 });
    freeVirus.position.set(width * 0.88, height * 0.76);
    freeVirus.alpha = 0;
    this.root.addChild(freeVirus);

    // ════════════════ 时间轴 ════════════════
    tl.to(this.root, { alpha: 1, duration: 0.6 });
    tl.to(title, { alpha: 1, duration: 0.6 }, '<');
    tl.call(() => ctx.setCaption(NARRATION.humoral));

    tl.to(bCell, { alpha: 1, duration: 0.5 }, '+=0.2');
    tl.to(bTag, { alpha: 1, duration: 0.5 }, '<');

    // 抗原靠近 B 细胞并与 BCR 结合（信号1）
    tl.to(antigens, { alpha: 1, duration: 0.4, stagger: 0.05 }, '+=0.1');
    antigens.forEach((a, i) => {
      const ang = (i / antigens.length) * Math.PI * 2;
      const tx = bCell.position.x + Math.cos(ang) * 54;
      const ty = bCell.position.y + Math.sin(ang) * 54;
      tl.to(a.position, { x: tx, y: ty, duration: 1.2, ease: EASE.softInOut }, i === 0 ? '+=0.1' : '<');
    });
    tl.add(highlightPulse(bCell, 1, 0.5), '-=0.3');
    tl.to(signal1Label, { alpha: 1, duration: 0.4 }, '-=0.2');

    // 辅助性 T 细胞提供信号2
    tl.to(helperT, { alpha: 1, duration: 0.5 }, '+=0.15');
    tl.to(helperTag, { alpha: 1, duration: 0.5 }, '<');

    // 细胞因子飞向 B 细胞（信号2）
    for (let i = 0; i < 6; i++) {
      const ck = createCytokine(6);
      ck.position.copyFrom(helperT.position);
      ck.alpha = 0;
      this.root.addChild(ck);
      tl.to(ck, { alpha: 0.95, duration: 0.3 }, i === 0 ? '-=0.1' : '<');
      tl.to(ck.position, {
        x: bCell.position.x + ((i % 3) - 1) * 16,
        y: bCell.position.y + 10,
        duration: 1.2,
        ease: EASE.softInOut
      }, '<');
      tl.to(ck, { alpha: 0, duration: 0.3 }, '-=0.2');
    }
    tl.to(signal2Label, { alpha: 1, duration: 0.4 }, '-=0.8');

    // B 细胞充分激活（双信号已具备）
    tl.add(highlightPulse(bCell, 2, 0.55));
    tl.to([signal1Label, signal2Label], { alpha: 0, duration: 0.3 }, '-=0.2');

    // 克隆扩增：三个浆细胞快速出现
    tl.to(expansionLabel, { alpha: 1, duration: 0.4 }, '+=0.05');
    tl.to([plasma1, plasma2, plasma3], { alpha: 1, duration: 0.5, stagger: 0.12 }, '+=0.05');
    tl.to([plasma1.scale, plasma2.scale, plasma3.scale], {
      x: 1, y: 1, duration: 0.8, ease: EASE.pop
    }, '<');
    tl.to(plasmaTag, { alpha: 1, duration: 0.4 }, '<');

    // 记忆 B 细胞出现
    tl.to(memoryB, { alpha: 1, duration: 0.5 }, '-=0.3');
    tl.to(memoryB.scale, { x: 1, y: 1, duration: 0.7, ease: EASE.pop }, '<');
    tl.to(memoryTag, { alpha: 1, duration: 0.4 }, '<');

    tl.to(expansionLabel, { alpha: 0, duration: 0.3 }, '+=0.3');
    tl.call(() => ctx.setCaption(NARRATION.humoralBinding));

    // 浆细胞分泌抗体飞向病原体
    tl.to(freeVirus, { alpha: 1, duration: 0.4 }, '+=0.1');

    const plasmaSrcs = [plasma1, plasma2, plasma3];
    antibodies.forEach((ab, i) => {
      const src = plasmaSrcs[i % plasmaSrcs.length];
      ab.position.set(src.position.x, src.position.y);
      ab.scale.set(0.4);
      const ang = (i / antibodies.length) * Math.PI * 2;
      const tx = freeVirus.position.x + Math.cos(ang) * 40;
      const ty = freeVirus.position.y + Math.sin(ang) * 40;
      tl.to(ab, { alpha: 1, duration: 0.22 }, i === 0 ? '+=0.1' : '<');
      tl.to(ab.scale, { x: 0.85, y: 0.85, duration: 0.4, ease: EASE.pop }, '<');
      tl.to(ab.position, { x: tx, y: ty, duration: 1.1, ease: EASE.softInOut }, '<');
      tl.to(ab, {
        rotation: Math.atan2(freeVirus.position.y - src.position.y, freeVirus.position.x - src.position.x) + Math.PI / 2,
        duration: 1.1,
        ease: EASE.softInOut
      }, '<');
    });

    // 抗原-抗体特异性结合高亮
    tl.add(highlightPulse(freeVirus, 1, 0.6));
    const haloRing = new Graphics();
    haloRing.lineStyle(2, PALETTE.antibodyCore, 0.7);
    haloRing.drawCircle(freeVirus.position.x, freeVirus.position.y, 56);
    haloRing.alpha = 0;
    this.root.addChild(haloRing);
    tl.to(haloRing, { alpha: 0.8, duration: 0.4 }, '<');
    tl.to(haloRing.scale, { x: 1.1, y: 1.1, duration: 1.0, ease: EASE.softInOut }, '<');
    tl.to(haloRing, { alpha: 0, duration: 0.8 }, '-=0.2');

    tl.to({}, { duration: 0.6 });
    tl.call(() => ctx.clearCaption());
    tl.to(this.root, { alpha: 0, duration: 0.6 });
  }

  dispose(): void {
    this.disposers.forEach((d) => d());
    this.root.destroy({ children: true });
  }
}
