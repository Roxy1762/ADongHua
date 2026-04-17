import { Container, Graphics } from 'pixi.js';
import { PALETTE } from '../core/palette';

export interface VirusOptions {
  radius?: number;
  color?: number;
  spikeColor?: number;
  spikeCount?: number;
}

/** 病原体（类病毒形态） */
export function createVirus(opts: VirusOptions = {}): Container {
  const c = new Container();
  const r = opts.radius ?? 22;
  const body = new Graphics();
  const color = opts.color ?? PALETTE.virus;
  const core = PALETTE.virusCore;
  const spikeColor = opts.spikeColor ?? PALETTE.antigenSpike;
  const spikes = opts.spikeCount ?? 10;

  // 外壳柔光
  body.beginFill(color, 0.25);
  body.drawCircle(0, 0, r * 1.45);
  body.endFill();

  // 主体
  body.lineStyle(1, core, 0.6);
  body.beginFill(color, 0.95);
  body.drawCircle(0, 0, r);
  body.endFill();

  // 内部纹理
  body.lineStyle(0);
  body.beginFill(core, 0.22);
  body.drawCircle(-r * 0.3, -r * 0.25, r * 0.25);
  body.drawCircle(r * 0.25, r * 0.15, r * 0.2);
  body.endFill();

  // 表面刺突（抗原决定簇）
  for (let i = 0; i < spikes; i++) {
    const a = (i / spikes) * Math.PI * 2;
    const sx = Math.cos(a) * r;
    const sy = Math.sin(a) * r;
    const tipX = Math.cos(a) * (r + 9);
    const tipY = Math.sin(a) * (r + 9);

    const stem = new Graphics();
    stem.lineStyle(2.2, spikeColor, 0.95);
    stem.moveTo(sx, sy);
    stem.lineTo(tipX, tipY);

    const knob = new Graphics();
    knob.beginFill(spikeColor, 1);
    knob.lineStyle(1, 0xffffff, 0.35);
    knob.drawCircle(tipX, tipY, 3.2);
    knob.endFill();

    c.addChild(stem, knob);
  }

  c.addChildAt(body, 0);
  return c;
}
