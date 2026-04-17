import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTagWithPin } from '../entities/labels';
import { createBCell } from '../entities/bCell';
import { createHelperTCell } from '../entities/helperTCell';
import { createPlasmaCell } from '../entities/plasmaCell';
import { createMemoryCell } from '../entities/memoryCell';
import { createAntibody } from '../entities/antibody';
import { createVirus } from '../entities/virus';
import { createAntigen } from '../entities/antigen';
import { createCytokine } from '../entities/cytokine';
import { EASE } from '../utils/easing';
import { floatLoop, membranePulse, highlightPulse } from '../utils/animation';

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

    // 左侧：B 细胞 + 抗原刺激（信号1）
    const bCell = createBCell({ radius: 50 });
    bCell.position.set(width * 0.28, height * 0.45);
    bCell.alpha = 0;
    this.root.addChild(bCell);
    this.disposers.push(() => membranePulse(bCell, 0.02, 3).kill());

    const bTag = makeTagWithPin('B 细胞', 0);
    bTag.position.set(width * 0.28, height * 0.45 + 96);
    bTag.alpha = 0;
    this.root.addChild(bTag);

    // 游离的抗原（来自病原体表面）
    const antigens: Container[] = [];
    for (let i = 0; i < 5; i++) {
      const a = createAntigen(10);
      a.position.set(width * 0.1 + i * 12, height * 0.2 + ((i * 37) % 40));
      a.alpha = 0;
      this.root.addChild(a);
      antigens.push(a);
    }

    // 中部：辅助性 T 细胞（信号2）
    const helperT = createHelperTCell(44);
    helperT.position.set(width * 0.5, height * 0.7);
    helperT.alpha = 0;
    this.root.addChild(helperT);

    const helperTag = makeTagWithPin('辅助性 T 细胞', 0);
    helperTag.position.set(width * 0.5, height * 0.7 + 84);
    helperTag.alpha = 0;
    this.root.addChild(helperTag);

    // 右侧：分化后的浆细胞 + 记忆B细胞（一开始隐藏）
    const plasma1 = createPlasmaCell(46);
    const plasma2 = createPlasmaCell(42);
    const memoryB = createMemoryCell('B', 38);
    plasma1.position.set(width * 0.66, height * 0.35);
    plasma2.position.set(width * 0.66, height * 0.58);
    memoryB.position.set(width * 0.82, height * 0.48);
    [plasma1, plasma2, memoryB].forEach((e) => {
      e.alpha = 0;
      e.scale.set(0.6);
      this.root.addChild(e);
      this.disposers.push(() => membranePulse(e, 0.02, 3).kill());
    });

    const plasmaTag = makeTagWithPin('浆细胞', 0);
    plasmaTag.position.set(width * 0.66, height * 0.35 - 76);
    plasmaTag.alpha = 0;
    this.root.addChild(plasmaTag);
    const memoryTag = makeTagWithPin('记忆 B 细胞', 0);
    memoryTag.position.set(width * 0.82, height * 0.48 + 74);
    memoryTag.alpha = 0;
    this.root.addChild(memoryTag);

    // 抗体群（浆细胞分泌）
    const antibodies: Container[] = [];
    for (let i = 0; i < 10; i++) {
      const ab = createAntibody(0.9);
      ab.alpha = 0;
      this.root.addChild(ab);
      antibodies.push(ab);
    }

    // 右下：游离病原体（抗体要去结合的目标）
    const freeVirus = createVirus({ radius: 22 });
    freeVirus.position.set(width * 0.9, height * 0.78);
    freeVirus.alpha = 0;
    this.root.addChild(freeVirus);

    // 时间轴
    tl.to(this.root, { alpha: 1, duration: 0.6 });
    tl.to(title, { alpha: 1, duration: 0.6 }, '<');
    tl.call(() => ctx.setCaption(NARRATION.humoral));

    tl.to(bCell, { alpha: 1, duration: 0.5 }, '+=0.2');
    tl.to(bTag, { alpha: 1, duration: 0.5 }, '<');

    // 抗原靠近 B 细胞并接触（信号1）
    tl.to(antigens, { alpha: 1, duration: 0.4, stagger: 0.05 }, '+=0.1');
    antigens.forEach((a, i) => {
      const ang = (i / antigens.length) * Math.PI * 2;
      const tx = bCell.position.x + Math.cos(ang) * 54;
      const ty = bCell.position.y + Math.sin(ang) * 54;
      tl.to(a.position, { x: tx, y: ty, duration: 1.2, ease: EASE.softInOut }, i === 0 ? '+=0.1' : '<');
    });
    tl.add(highlightPulse(bCell, 1, 0.5), '-=0.3');

    // 辅助性 T 细胞登场（信号2 + 细胞因子）
    tl.to(helperT, { alpha: 1, duration: 0.5 }, '+=0.2');
    tl.to(helperTag, { alpha: 1, duration: 0.5 }, '<');

    // 细胞因子飞向 B 细胞
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

    tl.add(highlightPulse(bCell, 2, 0.55));

    // 增殖分化：浆细胞 & 记忆B细胞出现
    tl.to([plasma1, plasma2], { alpha: 1, duration: 0.6, stagger: 0.15 }, '+=0.1');
    tl.to([plasma1.scale, plasma2.scale], {
      x: 1, y: 1, duration: 0.8, ease: EASE.pop
    }, '<');
    tl.to(plasmaTag, { alpha: 1, duration: 0.4 }, '<');

    tl.to(memoryB, { alpha: 1, duration: 0.5 }, '-=0.3');
    tl.to(memoryB.scale, { x: 1, y: 1, duration: 0.7, ease: EASE.pop }, '<');
    tl.to(memoryTag, { alpha: 1, duration: 0.4 }, '<');

    tl.call(() => ctx.setCaption(NARRATION.humoralBinding));

    // 浆细胞分泌抗体
    tl.to(freeVirus, { alpha: 1, duration: 0.4 }, '+=0.1');

    antibodies.forEach((ab, i) => {
      const srcX = (i % 2 === 0 ? plasma1 : plasma2).position.x;
      const srcY = (i % 2 === 0 ? plasma1 : plasma2).position.y;
      ab.position.set(srcX, srcY);
      ab.scale.set(0.4);
      // 抗体目的地：飞向病原体表面，均匀分布
      const ang = (i / antibodies.length) * Math.PI * 2;
      const tx = freeVirus.position.x + Math.cos(ang) * 40;
      const ty = freeVirus.position.y + Math.sin(ang) * 40;
      tl.to(ab, { alpha: 1, duration: 0.25 }, i === 0 ? '+=0.1' : '<');
      tl.to(ab.scale, { x: 0.85, y: 0.85, duration: 0.4, ease: EASE.pop }, '<');
      tl.to(ab.position, { x: tx, y: ty, duration: 1.2, ease: EASE.softInOut }, '<');
      tl.to(ab, { rotation: Math.atan2(freeVirus.position.y - srcY, freeVirus.position.x - srcX) + Math.PI / 2, duration: 1.2, ease: EASE.softInOut }, '<');
    });

    // 抗体与抗原特异性结合：克制高亮
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

// noop import usage
floatLoop;
