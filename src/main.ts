import './styles/global.css';
import { ImmuneAnimationApp } from './app';

function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: #${id}`);
  return el;
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new ImmuneAnimationApp({
    stageHost: $('stage-container'),
    captionsHost: $('captions'),
    navHost: $('chapter-nav'),
    controlsHost: $('controls'),
    indicatorHost: $('chapter-indicator')
  });
  app.init();

  // 关键字快捷键：空格播放/暂停，← → 章节跳转
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.code === 'Space') {
      e.preventDefault();
      const btns = document.querySelectorAll<HTMLButtonElement>('#controls button');
      const playPause = btns[1];
      playPause?.click();
    } else if (e.code === 'ArrowLeft') {
      const btns = document.querySelectorAll<HTMLButtonElement>('#controls button');
      btns[0]?.click();
    } else if (e.code === 'ArrowRight') {
      const btns = document.querySelectorAll<HTMLButtonElement>('#controls button');
      btns[2]?.click();
    }
  });
});
