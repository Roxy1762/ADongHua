import type { ChapterInfo } from '../core/types';

export interface ChapterNavHandle {
  setActive: (chapterId: string) => void;
}

export function mountChapterNav(
  host: HTMLElement,
  chapters: readonly ChapterInfo[],
  onSelect: (chapterId: string) => void
): ChapterNavHandle {
  host.innerHTML = '';
  const buttons = new Map<string, HTMLButtonElement>();
  chapters.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'chapter-chip';
    btn.type = 'button';
    btn.innerHTML = `
      <span class="chip-index">第 ${c.index} 章</span>
      <span class="chip-title">${escape(c.title)}</span>
    `;
    btn.addEventListener('click', () => onSelect(c.id));
    host.appendChild(btn);
    buttons.set(c.id, btn);
  });

  const setActive = (chapterId: string) => {
    buttons.forEach((btn, id) => {
      btn.classList.toggle('active', id === chapterId);
    });
  };

  return { setActive };
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return c;
    }
  });
}
