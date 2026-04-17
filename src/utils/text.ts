import { Text, TextStyle } from 'pixi.js';
import { PALETTE, STYLE } from '../core/palette';

export interface LabelOptions {
  fontSize?: number;
  color?: number;
  weight?: '400' | '500' | '600';
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
}

export function makeText(content: string, opts: LabelOptions = {}): Text {
  const style = new TextStyle({
    fontFamily: STYLE.labelFontFamily,
    fontSize: opts.fontSize ?? 18,
    fontWeight: opts.weight ?? '500',
    fill: opts.color ?? PALETTE.ink,
    align: opts.align ?? 'center',
    letterSpacing: opts.letterSpacing ?? 0.5
  });
  const t = new Text(content, style);
  t.resolution = Math.min(window.devicePixelRatio || 1, 2);
  t.anchor.set(0.5);
  return t;
}

export function splitLines(lines: readonly string[] | string): string[] {
  if (Array.isArray(lines)) return [...lines];
  return (lines as string).split('\n');
}
