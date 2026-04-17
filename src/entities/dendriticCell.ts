import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

/** 树突状细胞（多分支） */
export function createDendriticCell(radius = 52): Container {
  const c = new Container();

  // 柔光
  const glow = new Graphics();
  glow.beginFill(PALETTE.dendritic, 0.2);
  glow.drawCircle(0, 0, radius * 1.4);
  glow.endFill();
  c.addChild(glow);

  // 分支（随机性由种子化生成保证稳定）
  const branches = new Graphics();
  branches.lineStyle(3, PALETTE.dendriticCore, 0.55);
  const branchCount = 9;
  for (let i = 0; i < branchCount; i++) {
    const a = (i / branchCount) * Math.PI * 2 + 0.1 * ((i * 13) % 7);
    const len = radius * (1.1 + ((i * 7) % 5) * 0.08);
    branches.moveTo(Math.cos(a) * radius * 0.55, Math.sin(a) * radius * 0.55);
    branches.lineTo(Math.cos(a) * len, Math.sin(a) * len);
    // 分叉
    const fork = 0.25;
    branches.moveTo(Math.cos(a) * len * 0.8, Math.sin(a) * len * 0.8);
    branches.lineTo(
      Math.cos(a + fork) * len,
      Math.sin(a + fork) * len
    );
  }
  c.addChild(branches);

  // 主体
  const body = new Graphics();
  body.lineStyle(STYLE.lineWidth, PALETTE.dendriticCore, 0.55);
  body.beginFill(PALETTE.dendritic, 0.85);
  body.drawCircle(0, 0, radius * 0.62);
  body.endFill();

  body.lineStyle(0);
  body.beginFill(PALETTE.dendriticCore, 0.9);
  body.drawCircle(-radius * 0.08, -radius * 0.06, radius * 0.28);
  body.endFill();

  body.beginFill(0xffffff, 0.22);
  body.drawCircle(-radius * 0.18, -radius * 0.18, radius * 0.08);
  body.endFill();

  c.addChild(body);
  return c;
}
