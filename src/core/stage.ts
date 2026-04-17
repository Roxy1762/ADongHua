import { Application, Container, Graphics } from 'pixi.js';
import { PALETTE } from './palette';

export interface StageLayers {
  background: Container;
  scene: Container;
  overlay: Container;
}

export interface StageHandle {
  app: Application;
  root: Container;
  layers: StageLayers;
  width: number;
  height: number;
  resize: () => void;
  destroy: () => void;
}

const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 900; // 16:9

export function createStage(host: HTMLElement): StageHandle {
  const app = new Application({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    background: PALETTE.bgTop,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true
  });
  const canvas = app.view as HTMLCanvasElement;
  host.appendChild(canvas);

  const root = new Container();
  root.sortableChildren = true;
  app.stage.addChild(root);

  const background = new Container();
  const scene = new Container();
  const overlay = new Container();
  background.zIndex = 0;
  scene.zIndex = 10;
  overlay.zIndex = 20;
  root.addChild(background, scene, overlay);

  drawBackdrop(background, DESIGN_WIDTH, DESIGN_HEIGHT);

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height || (w * 9) / 16;
    const scale = Math.min(w / DESIGN_WIDTH, h / DESIGN_HEIGHT);
    app.renderer.resize(DESIGN_WIDTH * scale, DESIGN_HEIGHT * scale);
    root.scale.set(scale);
  };

  window.addEventListener('resize', resize);
  // 初始尺寸
  queueMicrotask(resize);

  const destroy = () => {
    window.removeEventListener('resize', resize);
    app.destroy(true, { children: true });
  };

  return {
    app,
    root,
    layers: { background, scene, overlay },
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    resize,
    destroy
  };
}

function drawBackdrop(target: Container, w: number, h: number) {
  const g = new Graphics();
  // 纵向柔和渐变（PIXI 没内置线性渐变，用多层矩形模拟）
  const steps = 24;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const color = lerpColor(PALETTE.bgTop, PALETTE.bgBottom, t);
    g.beginFill(color, 1);
    g.drawRect(0, (h / steps) * i, w, h / steps + 1);
    g.endFill();
  }
  target.addChild(g);

  // 两团柔光
  const glowA = new Graphics();
  glowA.beginFill(PALETTE.bgGlowA, 0.6);
  glowA.drawCircle(260, 180, 360);
  glowA.endFill();
  glowA.alpha = 0.75;
  target.addChild(glowA);

  const glowB = new Graphics();
  glowB.beginFill(PALETTE.bgGlowB, 0.55);
  glowB.drawCircle(w - 220, h - 160, 420);
  glowB.endFill();
  glowB.alpha = 0.7;
  target.addChild(glowB);

  // 轻微网格，增强科学感
  const grid = new Graphics();
  grid.lineStyle(1, 0x1b2a41, 0.03);
  const step = 80;
  for (let x = step; x < w; x += step) {
    grid.moveTo(x, 0);
    grid.lineTo(x, h);
  }
  for (let y = step; y < h; y += step) {
    grid.moveTo(0, y);
    grid.lineTo(w, y);
  }
  target.addChild(grid);
}

function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;
  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}
