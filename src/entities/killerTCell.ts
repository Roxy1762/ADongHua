import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

/** 细胞毒性 T 细胞 */
export function createKillerTCell(radius = 42): Container {
  const c = new Container();
  const body = new Graphics();

  body.beginFill(PALETTE.killerT, 0.22);
  body.drawCircle(0, 0, radius * 1.3);
  body.endFill();

  body.lineStyle(STYLE.lineWidth, PALETTE.killerTCore, 0.55);
  body.beginFill(PALETTE.killerT, STYLE.cytoplasmAlpha + 0.25);
  body.drawCircle(0, 0, radius);
  body.endFill();

  body.lineStyle(0);
  body.beginFill(PALETTE.killerTCore, 0.92);
  body.drawCircle(-radius * 0.08, -radius * 0.1, radius * 0.42);
  body.endFill();

  body.beginFill(0xffffff, 0.22);
  body.drawCircle(-radius * 0.24, -radius * 0.24, radius * 0.12);
  body.endFill();

  // 表面溶解颗粒（暗色小点，仅作视觉提示）
  const granules = new Graphics();
  granules.beginFill(PALETTE.killerTCore, 0.7);
  const seeds = [
    [radius * 0.4, radius * 0.1],
    [radius * 0.22, radius * 0.42],
    [-radius * 0.35, radius * 0.3],
    [radius * 0.05, -radius * 0.45]
  ];
  for (const [x, y] of seeds) granules.drawCircle(x, y, 2.4);
  granules.endFill();

  c.addChild(body, granules);
  return c;
}
