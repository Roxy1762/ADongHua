import { Container, Graphics } from 'pixi.js';
import { PALETTE } from '../core/palette';

/**
 * 抗体（Y 形结构模式图）
 * 机体产生的专门应对抗原的蛋白质称为抗体。
 */
export function createAntibody(scale = 1): Container {
  const c = new Container();
  const g = new Graphics();
  const color = PALETTE.antibody;
  const darker = PALETTE.antibodyCore;

  // 铰链光晕
  g.beginFill(color, 0.18);
  g.drawCircle(0, 0, 22 * scale);
  g.endFill();

  // 下方主干（Fc）
  g.lineStyle(0);
  g.beginFill(darker, 0.9);
  g.drawRoundedRect(-4 * scale, 0 * scale, 8 * scale, 22 * scale, 3 * scale);
  g.endFill();

  // 两个上臂（Fab）
  const armLen = 26 * scale;
  const armWidth = 7 * scale;
  const leftArm = new Graphics();
  leftArm.beginFill(color, 0.95);
  leftArm.drawRoundedRect(-armWidth / 2, -armLen, armWidth, armLen, armWidth / 2);
  leftArm.endFill();
  leftArm.rotation = -Math.PI / 4.2;

  const rightArm = new Graphics();
  rightArm.beginFill(color, 0.95);
  rightArm.drawRoundedRect(-armWidth / 2, -armLen, armWidth, armLen, armWidth / 2);
  rightArm.endFill();
  rightArm.rotation = Math.PI / 4.2;

  // 结合位点（上端亮点）
  const siteL = new Graphics();
  siteL.beginFill(PALETTE.antigenSpike, 1);
  siteL.drawCircle(0, 0, 3.2 * scale);
  siteL.endFill();
  // 放到左臂顶端
  const leftTipX = Math.sin(-Math.PI / 4.2) * armLen;
  const leftTipY = -Math.cos(-Math.PI / 4.2) * armLen;
  siteL.position.set(leftTipX, leftTipY);

  const siteR = new Graphics();
  siteR.beginFill(PALETTE.antigenSpike, 1);
  siteR.drawCircle(0, 0, 3.2 * scale);
  siteR.endFill();
  const rightTipX = Math.sin(Math.PI / 4.2) * armLen;
  const rightTipY = -Math.cos(Math.PI / 4.2) * armLen;
  siteR.position.set(rightTipX, rightTipY);

  c.addChild(g, leftArm, rightArm, siteL, siteR);
  return c;
}
