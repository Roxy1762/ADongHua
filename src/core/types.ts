import type { Container } from 'pixi.js';
import type gsap from 'gsap';

export interface ChapterInfo {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
}

export interface SceneContext {
  stage: Container; // 场景挂载容器
  width: number;
  height: number;
  setCaption: (lines: readonly string[] | string) => void;
  clearCaption: () => void;
}

export interface Scene {
  readonly chapter: ChapterInfo;
  build(ctx: SceneContext, tl: gsap.core.Timeline): void;
  /** 进入场景时调用（重置元素状态） */
  reset?(): void;
  /** 卸载时清理 */
  dispose?(): void;
}

export interface PlaybackState {
  playing: boolean;
  currentChapter: number;
  progress: number; // 0 ~ 1
}
