import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

export type MemoryKind = 'B' | 'T';

/** 记忆细胞（B / T 两种，外圈带有一层柔和环提示"长寿") */
export function createMemoryCell(kind: MemoryKind, radius = 40): Container {
  const c = new Container();
  const color =
    kind === 'B' ? PALETTE.memoryB : PALETTE.memoryT;
  const core =
    kind === 'B' ? PALETTE.memoryBCore : PALETTE.memoryTCore;

  const halo = new Graphics();
  halo.lineStyle(2, core, 0.22);
  halo.drawCircle(0, 0, radius * 1.28);
  halo.lineStyle(1, core, 0.14);
  halo.drawCircle(0, 0, radius * 1.45);
  c.addChild(halo);

  const body = new Graphics();
  body.beginFill(color, 0.2);
  body.drawCircle(0, 0, radius * 1.15);
  body.endFill();

  body.lineStyle(STYLE.lineWidth, core, 0.45);
  body.beginFill(color, STYLE.cytoplasmAlpha + 0.2);
  body.drawCircle(0, 0, radius);
  body.endFill();

  body.lineStyle(0);
  body.beginFill(core, 0.9);
  body.drawCircle(-radius * 0.1, -radius * 0.1, radius * 0.42);
  body.endFill();

  body.beginFill(0xffffff, 0.22);
  body.drawCircle(-radius * 0.25, -radius * 0.25, radius * 0.1);
  body.endFill();

  c.addChild(body);
  return c;
}
