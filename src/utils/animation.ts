import type { Container, DisplayObject } from 'pixi.js';
import gsap from 'gsap';
import { EASE } from './easing';

/** 让一个容器柔和地漂浮（适合细胞、抗原） */
export function floatLoop(
  target: DisplayObject,
  amplitudeX = 6,
  amplitudeY = 4,
  duration = 4
) {
  const baseX = target.position.x;
  const baseY = target.position.y;
  const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: EASE.softInOut } });
  tl.to(target.position, {
    x: baseX + amplitudeX,
    y: baseY - amplitudeY,
    duration
  });
  return tl;
}

/** 膜轻微波动（缩放） */
export function membranePulse(
  target: Container,
  scale = 0.02,
  duration = 2.4
) {
  const base = target.scale.x;
  const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: EASE.softInOut } });
  tl.to(target.scale, {
    x: base * (1 + scale),
    y: base * (1 + scale),
    duration
  });
  return tl;
}

/** 淡入 */
export function fadeIn(
  target: DisplayObject,
  duration = 0.5,
  delay = 0
): gsap.core.Tween {
  target.alpha = 0;
  return gsap.to(target, { alpha: 1, duration, delay, ease: EASE.soft });
}

/** 淡出 */
export function fadeOut(
  target: DisplayObject,
  duration = 0.5,
  delay = 0
): gsap.core.Tween {
  return gsap.to(target, { alpha: 0, duration, delay, ease: EASE.softIn });
}

/** 生成高亮"脉冲"提示（克制） */
export function highlightPulse(
  target: Container,
  times = 2,
  duration = 0.6
): gsap.core.Timeline {
  const base = target.scale.x || 1;
  const tl = gsap.timeline({ defaults: { ease: EASE.softInOut } });
  for (let i = 0; i < times; i++) {
    tl.to(target.scale, { x: base * 1.08, y: base * 1.08, duration: duration / 2 });
    tl.to(target.scale, { x: base, y: base, duration: duration / 2 });
  }
  return tl;
}

/** 沿直线移动 target 到目标坐标 */
export function moveTo(
  target: DisplayObject,
  x: number,
  y: number,
  duration = 1,
  ease: string = EASE.soft
): gsap.core.Tween {
  return gsap.to(target.position, { x, y, duration, ease });
}

/** 角度旋转（弧度） */
export function rotateBy(
  target: DisplayObject,
  delta: number,
  duration = 1
): gsap.core.Tween {
  return gsap.to(target, { rotation: target.rotation + delta, duration });
}
