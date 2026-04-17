import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

/** 辅助性 T 细胞 */
export function createHelperTCell(radius = 42): Container {
  const c = new Container();
  const body = new Graphics();

  body.beginFill(PALETTE.helperT, 0.2);
  body.drawCircle(0, 0, radius * 1.25);
  body.endFill();

  body.lineStyle(STYLE.lineWidth, PALETTE.helperTCore, 0.5);
  body.beginFill(PALETTE.helperT, STYLE.cytoplasmAlpha + 0.25);
  body.drawCircle(0, 0, radius);
  body.endFill();

  body.lineStyle(0);
  body.beginFill(PALETTE.helperTCore, 0.9);
  body.drawCircle(-radius * 0.1, -radius * 0.08, radius * 0.42);
  body.endFill();

  body.beginFill(0xffffff, 0.22);
  body.drawCircle(-radius * 0.25, -radius * 0.24, radius * 0.11);
  body.endFill();

  // TH 标记（一小枚三叉形识别结构）
  const mark = new Graphics();
  mark.lineStyle(2, PALETTE.helperTCore, 0.85);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    mark.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
    mark.lineTo(Math.cos(a) * (radius + 8), Math.sin(a) * (radius + 8));
  }

  c.addChild(body, mark);
  return c;
}
