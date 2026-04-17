// 16:9 设计坐标系下的常用布局工具
export const DESIGN = {
  w: 1600,
  h: 900
} as const;

export const CENTER = { x: DESIGN.w / 2, y: DESIGN.h / 2 };

export function gridPositions(
  cx: number,
  cy: number,
  cols: number,
  rows: number,
  gapX: number,
  gapY: number
): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  const totalW = (cols - 1) * gapX;
  const totalH = (rows - 1) * gapY;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push({ x: cx - totalW / 2 + c * gapX, y: cy - totalH / 2 + r * gapY });
    }
  }
  return out;
}

export function circlePositions(
  cx: number,
  cy: number,
  radius: number,
  count: number,
  startAngle = -Math.PI / 2
): Array<{ x: number; y: number }> {
  const arr: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    const a = startAngle + (i / count) * Math.PI * 2;
    arr.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
  }
  return arr;
}

export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
