// 统一缓动名（给 GSAP 使用）
export const EASE = {
  soft: 'power2.out',
  softIn: 'power2.in',
  softInOut: 'power2.inOut',
  pop: 'back.out(1.6)',
  elastic: 'elastic.out(1, 0.55)',
  linear: 'none'
} as const;

export type EaseName = (typeof EASE)[keyof typeof EASE];
