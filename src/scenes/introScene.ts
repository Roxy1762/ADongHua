import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';
import type { Scene, SceneContext, ChapterInfo } from '../core/types';
import { PALETTE, NARRATION } from '../core/palette';
import { makeChapterTitle, makeTagWithPin } from '../entities/labels';
import { createVirus } from '../entities/virus';
import { createAntigen } from '../entities/antigen';
import { EASE } from '../utils/easing';
import { floatLoop, fadeIn, fadeOut } from '../utils/animation';
import { makeText } from '../utils/text';

export class IntroScene implements Scene {
  readonly chapter: ChapterInfo = {
    id: 'intro',
    index: 1,
    title: '病原体入侵与抗原识别',
    subtitle: 'Pathogen Invasion & Antigen Recognition'
  };

  private root = new Container();
  private disposers: Array<() => void> = [];

  build(ctx: SceneContext, tl: gsap.core.Timeline): void {
    const { stage, width, height } = ctx;
    stage.addChild(this.root);
    this.root.alpha = 0;

    // 标题
    const title = makeChapterTitle(this.chapter.title, this.chapter.subtitle ?? '');
    title.position.set(width / 2, height / 2 - 40);
    title.alpha = 0;
    this.root.addChild(title);

    // 两道防线的示意：皮肤（横带） + 黏膜（横带）
    const defenseLayer = new Container();
    const skin = new Graphics();
    skin.beginFill(PALETTE.cream, 0.85);
    skin.drawRoundedRect(120, 240, width - 240, 46, 14);
    skin.endFill();
    const mucosa = new Graphics();
    mucosa.beginFill(PALETTE.tealSoft, 0.8);
    mucosa.drawRoundedRect(120, 310, width - 240, 44, 14);
    mucosa.endFill();
    const skinLabel = makeText('皮肤与黏膜 · 第一道防线', {
      fontSize: 14,
      color: PALETTE.inkSoft,
      weight: '500'
    });
    skinLabel.position.set(width / 2, 263);
    const mucosaLabel = makeText('体液杀菌物质与吞噬作用 · 第二道防线', {
      fontSize: 14,
      color: PALETTE.inkSoft,
      weight: '500'
    });
    mucosaLabel.position.set(width / 2, 332);
    defenseLayer.addChild(skin, mucosa, skinLabel, mucosaLabel);
    defenseLayer.alpha = 0;
    this.root.addChild(defenseLayer);

    // 漏网的病原体
    const virus = createVirus({ radius: 26 });
    virus.position.set(width * 0.18, height * 0.82);
    virus.alpha = 0;
    this.root.addChild(virus);
    this.disposers.push(() => floatLoop(virus, 5, 3, 3).kill());

    const tag = makeTagWithPin('病原体（如流感病毒）', 26, {
      color: PALETTE.labelBg,
      textColor: PALETTE.ink
    });
    tag.position.set(width * 0.18, height * 0.82 - 40);
    tag.alpha = 0;
    this.root.addChild(tag);

    // 抗原分子片段（从病原体表面"脱落"的小片段）
    const antigenGroup = new Container();
    const antigens: Container[] = [];
    for (let i = 0; i < 6; i++) {
      const a = createAntigen(9);
      a.alpha = 0;
      antigenGroup.addChild(a);
      antigens.push(a);
    }
    this.root.addChild(antigenGroup);

    const antigenTag = makeTagWithPin(
      '病原体表面的特定分子 · 抗原',
      24,
      { textColor: PALETTE.ink }
    );
    antigenTag.position.set(width * 0.62, height * 0.5);
    antigenTag.alpha = 0;
    this.root.addChild(antigenTag);

    // 时间轴
    tl.to(this.root, { alpha: 1, duration: 0.6, ease: EASE.soft });
    tl.from(title.scale, { x: 0.9, y: 0.9, duration: 0.8, ease: EASE.pop }, '<');
    tl.to(title, { alpha: 1, duration: 0.8, ease: EASE.soft }, '<');
    tl.call(() => ctx.setCaption(NARRATION.intro.slice(0, 2)));

    tl.to(defenseLayer, { alpha: 1, duration: 0.6 }, '+=0.2');
    tl.call(() => ctx.setCaption(NARRATION.intro));

    tl.to(title.position, { y: height / 2 - 180, duration: 1, ease: EASE.softInOut }, '+=0.4');
    tl.to(title, { alpha: 0.85, duration: 0.6 }, '<');

    // 病原体出现并漂浮穿越防线
    tl.to(virus, { alpha: 1, duration: 0.5 }, '+=0.1');
    tl.to(tag, { alpha: 1, duration: 0.4 }, '<');
    tl.to(virus.position, {
      x: width * 0.45,
      y: height * 0.55,
      duration: 2.2,
      ease: EASE.softInOut
    });
    tl.to(tag.position, {
      x: width * 0.45,
      y: height * 0.55 - 56,
      duration: 2.2,
      ease: EASE.softInOut
    }, '<');

    tl.call(() => ctx.setCaption(NARRATION.recognition));

    // 抗原片段从病毒表面释放
    antigens.forEach((a, i) => {
      const angle = (i / antigens.length) * Math.PI * 2;
      const vx = virus.position.x + Math.cos(angle) * 24;
      const vy = virus.position.y + Math.sin(angle) * 24;
      a.position.set(vx, vy);
      const tx = virus.position.x + Math.cos(angle) * 130;
      const ty = virus.position.y + Math.sin(angle) * 90;
      tl.to(a, { alpha: 1, duration: 0.4, ease: EASE.soft }, `-=${i === 0 ? 0.6 : 0.3}`);
      tl.to(a.position, { x: tx, y: ty, duration: 1.4, ease: EASE.softInOut }, '<');
    });

    tl.to(antigenTag, { alpha: 1, duration: 0.5 }, '-=1.0');

    // 停留收尾
    tl.to({}, { duration: 1.1 });
    tl.call(() => ctx.clearCaption());
    tl.to(this.root, { alpha: 0, duration: 0.6, ease: EASE.softIn });
  }

  dispose(): void {
    this.disposers.forEach((d) => d());
    this.root.destroy({ children: true });
  }
}

// helper to avoid TS unused warning
fadeIn;
fadeOut;
