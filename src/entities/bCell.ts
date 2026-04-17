import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

export interface CellOptions {
  radius?: number;
  bodyColor?: number;
  nucleusColor?: number;
  receptorColor?: number;
  receptors?: number;
}

/** B 细胞 */
export function createBCell(opts: CellOptions = {}): Container {
  const c = new Container();
  const r = opts.radius ?? 44;
  const body = new Graphics();
  const bodyColor = opts.bodyColor ?? PALETTE.bCell;
  const nucleus = opts.nucleusColor ?? PALETTE.bCellCore;

  // 外部柔光
  body.beginFill(bodyColor, 0.2);
  body.drawCircle(0, 0, r * 1.25);
  body.endFill();

  // 膜
  body.lineStyle(STYLE.lineWidth, nucleus, 0.4);
  body.beginFill(bodyColor, STYLE.cytoplasmAlpha + 0.2);
  body.drawCircle(0, 0, r);
  body.endFill();

  // 细胞核
  body.lineStyle(0);
  body.beginFill(nucleus, 0.9);
  body.drawCircle(-r * 0.12, -r * 0.1, r * 0.45);
  body.endFill();

  // 核内高光
  body.beginFill(0xffffff, 0.25);
  body.drawCircle(-r * 0.28, -r * 0.28, r * 0.12);
  body.endFill();

  c.addChild(body);

  // 表面受体（针对抗原的 B 细胞受体）
  const receptors = opts.receptors ?? 6;
  const receptorColor = opts.receptorColor ?? PALETTE.antibodyCore;
  for (let i = 0; i < receptors; i++) {
    const a = (i / receptors) * Math.PI * 2 + Math.PI / receptors;
    const sx = Math.cos(a) * r;
    const sy = Math.sin(a) * r;
    const tx = Math.cos(a) * (r + 10);
    const ty = Math.sin(a) * (r + 10);
    const rec = new Graphics();
    rec.lineStyle(2, receptorColor, 0.9);
    rec.moveTo(sx, sy);
    rec.lineTo(tx, ty);
    const tip = new Graphics();
    tip.beginFill(receptorColor, 1);
    tip.drawCircle(tx, ty, 2.4);
    tip.endFill();
    c.addChild(rec, tip);
  }

  return c;
}
