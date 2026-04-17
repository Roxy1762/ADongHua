export interface CaptionsHandle {
  set: (lines: readonly string[] | string) => void;
  clear: () => void;
}

export function mountCaptions(host: HTMLElement): CaptionsHandle {
  host.classList.add('captions');
  let current = '';
  let hideTimer: number | null = null;

  const set = (lines: readonly string[] | string) => {
    const text = Array.isArray(lines) ? lines.join('<br/>') : String(lines);
    if (text === current) {
      host.classList.add('visible');
      return;
    }
    current = text;
    host.innerHTML = text;
    host.classList.add('visible');
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const clear = () => {
    host.classList.remove('visible');
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      host.innerHTML = '';
      current = '';
    }, 450);
  };

  return { set, clear };
}
