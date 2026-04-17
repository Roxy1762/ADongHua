import { Container, Graphics } from 'pixi.js';
import { PALETTE } from '../core/palette';

/** 细胞因子（柔和的小颗粒 + 光晕） */
export function createCytokine(size = 8): Container {
  const c = new Container();
  const glow = new Graphics();
  glow.beginFill(PALETTE.cytokineGlow, 0.55);
  glow.drawCircle(0, 0, size * 2.4);
  glow.endFill();

  const body = new Graphics();
  body.lineStyle(1, 0xffffff, 0.55);
  body.beginFill(PALETTE.cytokine, 1);
  body.drawCircle(0, 0, size);
  body.endFill();

  c.addChild(glow, body);
  return c;
}
