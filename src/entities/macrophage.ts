import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

/** 巨噬细胞（轮廓不规则、伪足） */
export function createMacrophage(radius = 60): Container {
  const c = new Container();

  const glow = new Graphics();
  glow.beginFill(PALETTE.macrophage, 0.18);
  glow.drawCircle(0, 0, radius * 1.35);
  glow.endFill();
  c.addChild(glow);

  // 不规则轮廓
  const body = new Graphics();
  body.lineStyle(STYLE.lineWidth, PALETTE.macrophageCore, 0.4);
  body.beginFill(PALETTE.macrophage, 0.9);
  const pts: Array<[number, number]> = [];
  const seg = 18;
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const jitter = 1 + ((Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 0.08);
    pts.push([Math.cos(a) * radius * jitter, Math.sin(a) * radius * jitter]);
  }
  body.drawPolygon(pts.flat());
  body.endFill();

  // 内部颗粒（消化小泡）
  body.lineStyle(0);
  const vacuoles = [
    [radius * 0.3, radius * 0.1, 6],
    [-radius * 0.35, radius * 0.2, 5],
    [radius * 0.1, -radius * 0.3, 4],
    [-radius * 0.15, -radius * 0.15, 3.5]
  ];
  for (const [x, y, rr] of vacuoles) {
    body.beginFill(PALETTE.macrophageCore, 0.28);
    body.drawCircle(x, y, rr);
    body.endFill();
  }

  // 细胞核
  body.beginFill(PALETTE.macrophageCore, 0.9);
  body.drawCircle(-radius * 0.1, -radius * 0.02, radius * 0.3);
  body.endFill();

  body.beginFill(0xffffff, 0.22);
  body.drawCircle(-radius * 0.22, -radius * 0.14, radius * 0.08);
  body.endFill();

  c.addChild(body);
  return c;
}
