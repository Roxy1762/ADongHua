import { Container, Graphics } from 'pixi.js';
import { PALETTE } from '../core/palette';

/**
 * 抗原（病原体表面的特定分子/结构片段）
 * —— 抗原不等于整个病原体。
 */
export function createAntigen(size = 10, color = PALETTE.antigenSpike): Container {
  const c = new Container();

  // 柔光
  const glow = new Graphics();
  glow.beginFill(color, 0.22);
  glow.drawCircle(0, 0, size * 2);
  glow.endFill();
  c.addChild(glow);

  // 茎
  const stem = new Graphics();
  stem.lineStyle(2, color, 0.95);
  stem.moveTo(0, size * 1.1);
  stem.lineTo(0, -size * 0.2);
  c.addChild(stem);

  // 顶端"楔形"决定簇
  const knob = new Graphics();
  knob.lineStyle(1, 0xffffff, 0.4);
  knob.beginFill(color, 1);
  knob.drawPolygon([
    -size * 0.8, -size * 0.2,
    size * 0.8, -size * 0.2,
    size * 0.5, -size,
    -size * 0.5, -size
  ]);
  knob.endFill();
  c.addChild(knob);

  return c;
}
