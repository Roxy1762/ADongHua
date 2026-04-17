import { Container, Graphics } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';
import { makeText } from '../utils/text';

/** 标签胶囊（用于给实体命名） */
export function makeTag(
  text: string,
  opts: { color?: number; textColor?: number; fontSize?: number } = {}
): Container {
  const c = new Container();
  const t = makeText(text, {
    fontSize: opts.fontSize ?? 14,
    color: opts.textColor ?? PALETTE.ink,
    weight: '500'
  });

  const paddingX = 10;
  const paddingY = 6;
  const bgWidth = t.width + paddingX * 2;
  const bgHeight = t.height + paddingY * 2;
  const bg = new Graphics();
  bg.lineStyle(1, PALETTE.labelBorder, 1);
  bg.beginFill(opts.color ?? PALETTE.labelBg, 0.95);
  bg.drawRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, bgHeight / 2);
  bg.endFill();

  c.addChild(bg, t);
  return c;
}

/** 连接目标实体到某个标签位置的连接线（简洁圆点） */
export function makeTagWithPin(
  text: string,
  pinOffsetY = 28,
  opts: { color?: number; textColor?: number; fontSize?: number } = {}
): Container {
  const container = new Container();
  const tag = makeTag(text, opts);
  tag.y = -pinOffsetY;
  const dot = new Graphics();
  dot.beginFill(opts.color ?? PALETTE.blue, 1);
  dot.drawCircle(0, 0, 3);
  dot.endFill();
  dot.alpha = 0.65;
  container.addChild(dot, tag);
  return container;
}

/** 章节大标题 */
export function makeChapterTitle(
  title: string,
  subtitle?: string
): Container {
  const c = new Container();
  const t = makeText(title, { fontSize: 46, color: PALETTE.ink, weight: '600' });
  c.addChild(t);
  if (subtitle) {
    const s = makeText(subtitle, {
      fontSize: 18,
      color: PALETTE.inkMuted,
      weight: '400'
    });
    s.y = 44;
    c.addChild(s);
  }
  // 底部装饰线
  const line = new Graphics();
  line.lineStyle(2, PALETTE.blue, 0.6);
  line.moveTo(-40, subtitle ? 74 : 40);
  line.lineTo(40, subtitle ? 74 : 40);
  c.addChild(line);
  return c;
}

export { STYLE };
