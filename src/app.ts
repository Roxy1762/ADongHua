import gsap from 'gsap';
import { Container } from 'pixi.js';
import { createStage, type StageHandle } from './core/stage';
import { createMasterTimeline } from './core/timeline';
import type { ChapterInfo, Scene, SceneContext } from './core/types';
import { mountCaptions, type CaptionsHandle } from './ui/captions';
import { mountChapterNav, type ChapterNavHandle } from './ui/chapterNav';
import { mountControls, type ControlsHandle } from './ui/controls';

import { IntroScene } from './scenes/introScene';
import { AntigenPresentationScene } from './scenes/antigenPresentationScene';
import { HumoralImmunityScene } from './scenes/humoralImmunityScene';
import { CellularImmunityScene } from './scenes/cellularImmunityScene';
import { MemoryResponseScene } from './scenes/memoryResponseScene';
import { SummaryScene } from './scenes/summaryScene';

export interface AppHosts {
  stageHost: HTMLElement;
  captionsHost: HTMLElement;
  navHost: HTMLElement;
  controlsHost: HTMLElement;
  indicatorHost: HTMLElement;
}

export class ImmuneAnimationApp {
  private stage!: StageHandle;
  private scenes: Scene[] = [];
  private chapters: ChapterInfo[] = [];
  private captions!: CaptionsHandle;
  private nav!: ChapterNavHandle;
  private controls!: ControlsHandle;
  private master = createMasterTimeline();

  constructor(private hosts: AppHosts) {}

  init(): void {
    this.stage = createStage(this.hosts.stageHost);
    this.captions = mountCaptions(this.hosts.captionsHost);

    this.scenes = [
      new IntroScene(),
      new AntigenPresentationScene(),
      new HumoralImmunityScene(),
      new CellularImmunityScene(),
      new MemoryResponseScene(),
      new SummaryScene()
    ];
    this.chapters = this.scenes.map((s) => s.chapter);

    // 逐场景构建
    this.scenes.forEach((scene) => {
      const sceneLayer = new Container();
      this.stage.layers.scene.addChild(sceneLayer);
      const ctx: SceneContext = {
        stage: sceneLayer,
        width: this.stage.width,
        height: this.stage.height,
        setCaption: (lines) => this.captions.set(lines),
        clearCaption: () => this.captions.clear()
      };
      this.master.addChapter(scene.chapter.id, undefined, (tl) => {
        scene.build(ctx, tl);
      });
    });

    // 控制 UI
    this.controls = mountControls(this.hosts.controlsHost, {
      onPlay: () => this.play(),
      onPause: () => this.pause(),
      onRestart: () => this.restart(),
      onPrev: () => this.jumpBy(-1),
      onNext: () => this.jumpBy(1)
    });

    this.nav = mountChapterNav(this.hosts.navHost, this.chapters, (id) =>
      this.seekChapter(id)
    );

    // 订阅 timeline 事件
    this.master.onChapterChange((id) => {
      this.nav.setActive(id);
      this.updateIndicator(id);
    });
    this.master.onProgress((p) => {
      this.controls.setProgress(p);
    });
    this.master.master.eventCallback('onComplete', () => {
      this.controls.setPlaying(false);
    });

    // 初始状态
    this.nav.setActive(this.chapters[0]!.id);
    this.updateIndicator(this.chapters[0]!.id);
    this.controls.setPlaying(false);
  }

  play(): void {
    if (this.master.master.progress() >= 1) {
      this.master.master.restart();
    } else {
      this.master.master.play();
    }
    this.controls.setPlaying(true);
  }

  pause(): void {
    this.master.master.pause();
    this.controls.setPlaying(false);
  }

  restart(): void {
    this.master.master.restart();
    this.master.master.play();
    this.controls.setPlaying(true);
  }

  seekChapter(id: string): void {
    const start = this.master.getChapterStart(id);
    if (start === null) return;
    this.master.master.pause();
    this.master.master.seek(start, false);
    this.master.master.play();
    this.controls.setPlaying(true);
  }

  private jumpBy(delta: number): void {
    const currentIndex = this.getCurrentChapterIndex();
    const target = Math.max(0, Math.min(this.chapters.length - 1, currentIndex + delta));
    const id = this.chapters[target]!.id;
    this.seekChapter(id);
  }

  private getCurrentChapterIndex(): number {
    const t = this.master.master.time();
    let idx = 0;
    for (let i = 0; i < this.chapters.length; i++) {
      const start = this.master.getChapterStart(this.chapters[i]!.id);
      if (start !== null && t >= start - 0.001) idx = i;
    }
    return idx;
  }

  private updateIndicator(id: string): void {
    const c = this.chapters.find((x) => x.id === id);
    if (!c) return;
    const idx = this.hosts.indicatorHost.querySelector('.chapter-index');
    const title = this.hosts.indicatorHost.querySelector('.chapter-title');
    if (idx) idx.textContent = `第 ${c.index} 章`;
    if (title) title.textContent = c.title;
  }

  destroy(): void {
    this.master.master.kill();
    this.scenes.forEach((s) => s.dispose?.());
    this.stage.destroy();
  }
}

// 让未显式使用的类型 tree-shakeable 时也不报错
export { gsap };
