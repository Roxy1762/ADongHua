import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTag, makeTagWithPin } from '../entities/labels';
import { createInfectedCell } from '../entities/infectedCell';
import { createKillerTCell } from '../entities/killerTCell';
import { createHelperTCell } from '../entities/helperTCell';
import { createMacrophage } from '../entities/macrophage';
import { createMemoryCell } from '../entities/memoryCell';
import { createVirus } from '../entities/virus';
import { createCytokine } from '../entities/cytokine';
import { EASE } from '../utils/easing';
import { membranePulse, highlightPulse } from '../utils/animation';

export class CellularImmunityScene implements Scene {
  readonly chapter: ChapterInfo = {
    id: 'cellular',
    index: 4,
    title: '细胞免疫过程',
    subtitle: 'Cellular Immunity'
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

    // 被感染的宿主细胞（靶细胞）
    const target = createInfectedCell(70, false);
    target.position.set(width * 0.3, height * 0.55);
    target.alpha = 0;
    this.root.addChild(target);
    this.disposers.push(() => membranePulse(target, 0.02, 3.5).kill());

    const targetTag = makeTagWithPin('被感染的宿主细胞（靶细胞）', 0);
    targetTag.position.set(width * 0.3, height * 0.55 + 120);
    targetTag.alpha = 0;
    this.root.addChild(targetTag);

    // 病毒
    const virus = createVirus({ radius: 18 });
    virus.position.set(width * 0.15, height * 0.28);
    virus.alpha = 0;
    this.root.addChild(virus);

    // 辅助性 T 细胞
    const helperT = createHelperTCell(42);
    helperT.position.set(width * 0.5, height * 0.2);
    helperT.alpha = 0;
    this.root.addChild(helperT);
    const helperTag = makeTagWithPin('辅助性 T 细胞', 0);
    helperTag.position.set(width * 0.5, height * 0.2 + 76);
    helperTag.alpha = 0;
    this.root.addChild(helperTag);

    // 两个细胞毒性 T 细胞（体现克隆扩增后的多个效应细胞）
    const killer1 = createKillerTCell(44);
    killer1.position.set(width * 0.84, height * 0.47);
    killer1.alpha = 0;
    this.root.addChild(killer1);
    this.disposers.push(() => membranePulse(killer1, 0.025, 3).kill());

    const killer2 = createKillerTCell(37);
    killer2.position.set(width * 0.88, height * 0.62);
    killer2.alpha = 0;
    this.root.addChild(killer2);
    this.disposers.push(() => membranePulse(killer2, 0.02, 3.3).kill());

    const killerTag = makeTagWithPin('细胞毒性 T 细胞（CTL）', 0);
    killerTag.position.set(width * 0.86, height * 0.56 + 76);
    killerTag.alpha = 0;
    this.root.addChild(killerTag);

    // 记忆 T 细胞
    const memoryT = createMemoryCell('T', 38);
    memoryT.position.set(width * 0.72, height * 0.25);
    memoryT.alpha = 0;
    memoryT.scale.set(0.6);
    this.root.addChild(memoryT);
    const memoryTag = makeTagWithPin('记忆 T 细胞', 0);
    memoryTag.position.set(width * 0.72, height * 0.25 + 70);
    memoryTag.alpha = 0;
    this.root.addChild(memoryTag);

    // 巨噬细胞
    const macro = createMacrophage(58);
    macro.position.set(width * 0.3, height * 0.84);
    macro.alpha = 0;
    macro.scale.set(0.85);
    this.root.addChild(macro);
    const macroTag = makeTagWithPin('巨噬细胞 · 吞噬清除', 0);
    macroTag.position.set(width * 0.3, height * 0.84 + 84);
    macroTag.alpha = 0;
    this.root.addChild(macroTag);

    // 靶细胞表面 MHC-Ⅰ 呈递抗原肽段
    const surfaceAntigens: Graphics[] = [];
    for (let i = 0; i < 6; i++) {
      const g = new Graphics();
      const a = (i / 6) * Math.PI * 2;
      const sx = target.position.x + Math.cos(a) * 70;
      const sy = target.position.y + Math.sin(a) * 70;
      const tx = target.position.x + Math.cos(a) * 80;
      const ty = target.position.y + Math.sin(a) * 80;
      g.lineStyle(1.8, PALETTE.antigenSpike, 0.9);
      g.moveTo(sx, sy);
      g.lineTo(tx, ty);
      g.beginFill(PALETTE.antigenSpike, 1);
      g.drawCircle(tx, ty, 2.6);
      g.endFill();
      g.alpha = 0;
      this.root.addChild(g);
      surfaceAntigens.push(g);
    }

    // MHC-Ⅰ 标注（感染后才显示）
    const mhcLabel = makeTag('MHC-Ⅰ 分子呈递抗原肽段', {
      color: PALETTE.infectedCell,
      textColor: PALETTE.infectedCellCore,
      fontSize: 13
    });
    mhcLabel.position.set(target.position.x - 128, target.position.y - 96);
    mhcLabel.alpha = 0;
    this.root.addChild(mhcLabel);

    // 穿孔素/颗粒酶标注（CTL 与靶细胞接触时显示）
    const perforinLabel = makeTag('穿孔素 / 颗粒酶', {
      color: 0xebf0ff,
      textColor: PALETTE.killerTCore,
      fontSize: 13
    });
    perforinLabel.position.set(target.position.x + 90, target.position.y - 80);
    perforinLabel.alpha = 0;
    this.root.addChild(perforinLabel);

    // ════════════════ 时间轴 ════════════════
    tl.to(this.root, { alpha: 1, duration: 0.6 });
    tl.to(title, { alpha: 1, duration: 0.6 }, '<');
    tl.call(() => ctx.setCaption(NARRATION.cellular));

    // 靶细胞与病毒登场
    tl.to(target, { alpha: 1, duration: 0.5 }, '+=0.2');
    tl.to(targetTag, { alpha: 1, duration: 0.5 }, '<');
    tl.to(virus, { alpha: 1, duration: 0.4 }, '+=0.1');

    // 病毒侵入靶细胞
    tl.to(virus.position, {
      x: target.position.x - 14,
      y: target.position.y - 10,
      duration: 1.6,
      ease: EASE.softInOut
    });
    tl.to(virus.scale, { x: 0.4, y: 0.4, duration: 0.8, ease: EASE.softIn }, '-=0.6');
    tl.to(virus, { alpha: 0, duration: 0.6 }, '-=0.4');

    // 靶细胞膜出现 MHC-Ⅰ 呈递的抗原肽
    tl.to(surfaceAntigens, { alpha: 1, duration: 0.5, stagger: 0.08 });
    tl.add(highlightPulse(target, 1, 0.6), '-=0.3');
    tl.to(mhcLabel, { alpha: 1, duration: 0.4 }, '-=0.2');

    // 辅助性 T 细胞登场，释放细胞因子激活 CTL
    tl.to(helperT, { alpha: 1, duration: 0.5 }, '+=0.2');
    tl.to(helperTag, { alpha: 1, duration: 0.5 }, '<');
    for (let i = 0; i < 5; i++) {
      const ck = createCytokine(6);
      ck.position.copyFrom(helperT.position);
      ck.alpha = 0;
      this.root.addChild(ck);
      tl.to(ck, { alpha: 0.95, duration: 0.25 }, i === 0 ? '-=0.1' : '<');
      tl.to(ck.position, {
        x: killer1.position.x - 16 + ((i % 3) - 1) * 10,
        y: killer1.position.y - 8,
        duration: 1.1,
        ease: EASE.softInOut
      }, '<');
      tl.to(ck, { alpha: 0, duration: 0.35 }, '-=0.3');
    }

    // 两个 CTL 登场
    tl.to([killer1, killer2], { alpha: 1, duration: 0.4, stagger: 0.14 }, '-=0.6');
    tl.to(killerTag, { alpha: 1, duration: 0.4 }, '<');
    tl.add(highlightPulse(killer1, 1, 0.5));
    tl.call(() => ctx.setCaption(NARRATION.cellularKilling));

    // killer1 靠近靶细胞
    tl.to(killer1.position, {
      x: target.position.x + 80,
      y: target.position.y,
      duration: 1.4,
      ease: EASE.softInOut
    });
    tl.to(killerTag.position, {
      x: target.position.x + 80,
      y: target.position.y + 80,
      duration: 1.4,
      ease: EASE.softInOut
    }, '<');
    tl.to(mhcLabel, { alpha: 0, duration: 0.3 }, '<');

    // 接触后释放穿孔素/颗粒酶
    tl.to(perforinLabel, { alpha: 1, duration: 0.4 });
    tl.to(perforinLabel, { alpha: 0, duration: 0.3 }, '+=0.7');

    // 靶细胞裂解（凋亡）
    const crack = new Graphics();
    crack.lineStyle(2, PALETTE.infectedCellCore, 0.8);
    crack.drawCircle(target.position.x, target.position.y, 74);
    crack.alpha = 0;
    this.root.addChild(crack);
    tl.to(crack, { alpha: 0.8, duration: 0.3 });
    tl.to(crack.scale, { x: 1.25, y: 1.25, duration: 1.0, ease: EASE.softInOut }, '<');
    tl.to(crack, { alpha: 0, duration: 0.6 }, '-=0.3');

    tl.to(target.scale, { x: 0.84, y: 0.84, duration: 0.8, ease: EASE.softIn }, '-=1.0');
    tl.to(target, { alpha: 0.38, duration: 0.8, ease: EASE.softIn }, '<');
    tl.to(surfaceAntigens, { alpha: 0.15, duration: 0.6 }, '<');

    // 巨噬细胞清除残体
    tl.to(macro, { alpha: 1, duration: 0.5 }, '+=0.1');
    tl.to(macroTag, { alpha: 1, duration: 0.5 }, '<');
    tl.to(macro.scale, { x: 1, y: 1, duration: 0.6, ease: EASE.pop }, '<');
    tl.to(macro.position, {
      x: target.position.x - 40,
      y: target.position.y + 30,
      duration: 1.2,
      ease: EASE.softInOut
    });
    tl.add(highlightPulse(macro, 1, 0.5));

    // 记忆 T 细胞出现
    tl.to(memoryT, { alpha: 1, duration: 0.5 }, '-=0.5');
    tl.to(memoryT.scale, { x: 1, y: 1, duration: 0.7, ease: EASE.pop }, '<');
    tl.to(memoryTag, { alpha: 1, duration: 0.5 }, '<');

    tl.to({}, { duration: 0.5 });
    tl.call(() => ctx.clearCaption());
    tl.to(this.root, { alpha: 0, duration: 0.6 });
  }

  dispose(): void {
    this.disposers.forEach((d) => d());
    this.root.destroy({ children: true });
  }
}
