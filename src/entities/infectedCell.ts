import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

/**
 * 被感染的宿主细胞（靶细胞）
 * 膜表面带少量"抗原片段"，提示已被感染。
 */
export function createInfectedCell(radius = 56, showAntigen = true): Container {
  const c = new Container();

  const glow = new Graphics();
  glow.beginFill(PALETTE.infectedCell, 0.18);
  glow.drawCircle(0, 0, radius * 1.3);
  glow.endFill();
  c.addChild(glow);

  const body = new Graphics();
  body.lineStyle(STYLE.lineWidth, PALETTE.infectedCellCore, 0.5);
  body.beginFill(PALETTE.infectedCell, 0.88);
  body.drawCircle(0, 0, radius);
  body.endFill();

  // 细胞核
  body.lineStyle(0);
  body.beginFill(PALETTE.infectedCellCore, 0.85);
  body.drawCircle(-radius * 0.1, -radius * 0.08, radius * 0.32);
  body.endFill();

  // 胞内"异常"痕迹
  body.beginFill(PALETTE.infectedCellCore, 0.35);
  body.drawCircle(radius * 0.25, radius * 0.15, radius * 0.12);
  body.drawCircle(-radius * 0.2, radius * 0.28, radius * 0.08);
  body.endFill();

  c.addChild(body);

  if (showAntigen) {
    // 膜表面呈递的"抗原片段"
    const count = 6;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const sx = Math.cos(a) * radius;
      const sy = Math.sin(a) * radius;
      const tx = Math.cos(a) * (radius + 8);
      const ty = Math.sin(a) * (radius + 8);
      const spike = new Graphics();
      spike.lineStyle(1.8, PALETTE.antigenSpike, 0.9);
      spike.moveTo(sx, sy);
      spike.lineTo(tx, ty);
      const tip = new Graphics();
      tip.beginFill(PALETTE.antigenSpike, 1);
      tip.drawCircle(tx, ty, 2.4);
      tip.endFill();
      c.addChild(spike, tip);
    }
  }
  return c;
}
