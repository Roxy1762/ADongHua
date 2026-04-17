import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTagWithPin } from '../entities/labels';
import { createDendriticCell } from '../entities/dendriticCell';
import { createMacrophage } from '../entities/macrophage';
import { createBCell } from '../entities/bCell';
import { createHelperTCell } from '../entities/helperTCell';
import { createVirus } from '../entities/virus';
import { createAntigen } from '../entities/antigen';
import { createCytokine } from '../entities/cytokine';
import { EASE } from '../utils/easing';
import { floatLoop, membranePulse, highlightPulse } from '../utils/animation';

export class AntigenPresentationScene implements Scene {
  readonly chapter: ChapterInfo = {
    id: 'presentation',
    index: 2,
    title: '抗原呈递与辅助性T细胞激活',
    subtitle: 'Antigen Presentation & Helper T Activation'
  };

  private root = new Container();
  private disposers: Array<() => void> = [];

  build(ctx: SceneContext, tl: gsap.core.Timeline): void {
    const { stage, width, height } = ctx;
    stage.addChild(this.root);
    this.root.alpha = 0;

    const title = makeChapterTitle(this.chapter.title, this.chapter.subtitle ?? '');
    title.position.set(width / 2, 90);
    title.scale.set(0.72);
    title.alpha = 0;
    this.root.addChild(title);

    // 三个抗原呈递细胞并排
    const apcY = height * 0.48;
    const dendritic = createDendriticCell(54);
    const macrophage = createMacrophage(58);
    const bCellAPC = createBCell({ radius: 46 });

    dendritic.position.set(width * 0.28, apcY);
    macrophage.position.set(width * 0.5, apcY);
    bCellAPC.position.set(width * 0.72, apcY);

    [dendritic, macrophage, bCellAPC].forEach((e) => {
      e.alpha = 0;
      this.root.addChild(e);
      this.disposers.push(() => membranePulse(e, 0.02, 3).kill());
      this.disposers.push(() => floatLoop(e, 4, 3, 4).kill());
    });

    // 标签
    const labelY = apcY + 90;
    const tagD = makeTagWithPin('树突状细胞', 0);
    const tagM = makeTagWithPin('巨噬细胞', 0);
    const tagB = makeTagWithPin('B 细胞', 0);
    tagD.position.set(width * 0.28, labelY);
    tagM.position.set(width * 0.5, labelY);
    tagB.position.set(width * 0.72, labelY);
    [tagD, tagM, tagB].forEach((t) => {
      t.alpha = 0;
      this.root.addChild(t);
    });

    // 抗原 / 病原体从上方下来
    const virus = createVirus({ radius: 22 });
    virus.position.set(width * 0.5, height * 0.1);
    virus.alpha = 0;
    this.root.addChild(virus);

    // 辅助性 T 细胞在右下
    const helperT = createHelperTCell(46);
    helperT.position.set(width * 0.5, height * 0.82);
    helperT.alpha = 0;
    this.root.addChild(helperT);
    this.disposers.push(() => membranePulse(helperT, 0.03, 3).kill());

    const tagHelper = makeTagWithPin('辅助性 T 细胞', 0);
    tagHelper.position.set(width * 0.5, height * 0.82 + 80);
    tagHelper.alpha = 0;
    this.root.addChild(tagHelper);

    // APC → 辅助性T细胞 的信号线
    const bridgeLines = new Graphics();
    this.root.addChild(bridgeLines);

    // 时间轴
    tl.to(this.root, { alpha: 1, duration: 0.6 });
    tl.to(title, { alpha: 1, duration: 0.6 }, '<');
    tl.call(() => ctx.setCaption(NARRATION.presentation));

    tl.to([dendritic, macrophage, bCellAPC], { alpha: 1, duration: 0.6, stagger: 0.15 }, '+=0.2');
    tl.to([tagD, tagM, tagB], { alpha: 1, duration: 0.5, stagger: 0.12 }, '<');

    // 病原体落下并释放抗原
    tl.to(virus, { alpha: 1, duration: 0.4 }, '+=0.2');
    tl.to(virus.position, { y: apcY - 80, duration: 1.2, ease: EASE.softInOut });

    // 抗原片段从病毒飞向各个APC
    const releasedAntigens: Container[] = [];
    const targets = [
      { ex: dendritic.position.x, ey: dendritic.position.y },
      { ex: macrophage.position.x, ey: macrophage.position.y },
      { ex: bCellAPC.position.x, ey: bCellAPC.position.y }
    ];
    targets.forEach((t, i) => {
      const a = createAntigen(9);
      a.position.copyFrom(virus.position);
      a.alpha = 0;
      this.root.addChild(a);
      releasedAntigens.push(a);
      tl.to(a, { alpha: 1, duration: 0.3 }, `+=${i === 0 ? 0.05 : 0}`);
      tl.to(a.position, {
        x: t.ex + (i - 1) * 6,
        y: t.ey - 24,
        duration: 1.0,
        ease: EASE.softInOut
      }, '<');
    });

    // APC 加工处理抗原（缩放脉冲 + 膜表面小抗原出现）
    tl.add(() => {
      releasedAntigens.forEach((a) => (a.alpha = 0.9));
    });
    [dendritic, macrophage, bCellAPC].forEach((e) => {
      tl.add(highlightPulse(e, 1, 0.6), '-=0.4');
    });

    // 抗原呈递：从APC顶端升起一个小抗原作为"呈递"视觉
    const presented: Container[] = [dendritic, macrophage, bCellAPC].map((e) => {
      const pres = createAntigen(8);
      pres.position.set(e.position.x, e.position.y - 60);
      pres.alpha = 0;
      this.root.addChild(pres);
      return pres;
    });
    tl.to(presented, { alpha: 1, duration: 0.6, stagger: 0.1 }, '+=0.1');

    // 辅助性 T 细胞登场
    tl.to(helperT, { alpha: 1, duration: 0.5 }, '+=0.2');
    tl.to(tagHelper, { alpha: 1, duration: 0.5 }, '<');
    tl.call(() => ctx.setCaption(NARRATION.helperActivation));

    // 将抗原呈递细胞与辅助性 T 细胞以柔和虚线连接
    tl.add(() => {
      bridgeLines.clear();
      bridgeLines.lineStyle(1.5, PALETTE.helperTCore, 0.45);
      [dendritic, macrophage, bCellAPC].forEach((e) => {
        const x1 = e.position.x;
        const y1 = e.position.y + 40;
        const x2 = helperT.position.x;
        const y2 = helperT.position.y - 40;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - 20;
        // 简易贝塞尔
        for (let t = 0; t < 1; t += 0.05) {
          const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
          const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
          if (t === 0) bridgeLines.moveTo(px, py);
          else bridgeLines.lineTo(px, py);
        }
      });
    });

    // 辅助性 T 细胞被激活并释放细胞因子
    tl.add(highlightPulse(helperT, 2, 0.6));
    const cytokines: Container[] = [];
    for (let i = 0; i < 8; i++) {
      const ck = createCytokine(6);
      ck.alpha = 0;
      ck.position.copyFrom(helperT.position);
      this.root.addChild(ck);
      cytokines.push(ck);
    }
    cytokines.forEach((ck, i) => {
      const a = (i / cytokines.length) * Math.PI * 2;
      const tx = helperT.position.x + Math.cos(a) * 180;
      const ty = helperT.position.y + Math.sin(a) * 120;
      tl.to(ck, { alpha: 0.95, duration: 0.35 }, i === 0 ? '-=0.1' : '<');
      tl.to(ck.position, { x: tx, y: ty, duration: 1.2, ease: EASE.softInOut }, '<');
      tl.to(ck, { alpha: 0, duration: 0.5, ease: EASE.softIn }, '-=0.3');
    });

    tl.to({}, { duration: 0.6 });
    tl.call(() => ctx.clearCaption());
    tl.to(this.root, { alpha: 0, duration: 0.6 });
  }

  dispose(): void {
    this.disposers.forEach((d) => d());
    this.root.destroy({ children: true });
  }
}
