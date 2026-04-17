import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

/** 浆细胞（抗体合成旺盛，内质网网状纹理） */
export function createPlasmaCell(radius = 48): Container {
  const c = new Container();
  const body = new Graphics();

  body.beginFill(PALETTE.plasmaCell, 0.22);
  body.drawCircle(0, 0, radius * 1.3);
  body.endFill();

  body.lineStyle(STYLE.lineWidth, PALETTE.plasmaCore, 0.5);
  body.beginFill(PALETTE.plasmaCell, STYLE.cytoplasmAlpha + 0.25);
  body.drawCircle(0, 0, radius);
  body.endFill();

  // 内质网网状纹理
  body.lineStyle(1.2, PALETTE.plasmaCore, 0.35);
  for (let i = 0; i < 4; i++) {
    const yy = -radius * 0.4 + i * radius * 0.25;
    body.moveTo(-radius * 0.7, yy);
    body.bezierCurveTo(
      -radius * 0.2,
      yy - radius * 0.12,
      radius * 0.2,
      yy + radius * 0.12,
      radius * 0.7,
      yy
    );
  }

  // 核偏于一侧
  body.lineStyle(0);
  body.beginFill(PALETTE.plasmaCore, 0.9);
  body.drawCircle(-radius * 0.35, -radius * 0.18, radius * 0.3);
  body.endFill();

  body.beginFill(0xffffff, 0.22);
  body.drawCircle(-radius * 0.45, -radius * 0.3, radius * 0.08);
  body.endFill();

  c.addChild(body);
  return c;
}
