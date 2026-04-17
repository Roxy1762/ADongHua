export interface ControlsCallbacks {
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export interface ControlsHandle {
  setPlaying: (playing: boolean) => void;
  setProgress: (p: number) => void;
}

export function mountControls(
  host: HTMLElement,
  cbs: ControlsCallbacks
): ControlsHandle {
  host.innerHTML = '';

  const prev = button('上一章', 'secondary');
  const playPause = button('播放', 'primary');
  const next = button('下一章', 'secondary');
  const restart = button('重播', 'secondary');

  const progressWrap = document.createElement('div');
  progressWrap.className = 'progress';
  const progressBar = document.createElement('span');
  progressWrap.appendChild(progressBar);

  let playing = false;
  const setPlaying = (p: boolean) => {
    playing = p;
    playPause.textContent = p ? '暂停' : '播放';
  };
  const setProgress = (p: number) => {
    progressBar.style.width = `${Math.max(0, Math.min(1, p)) * 100}%`;
  };

  playPause.addEventListener('click', () => {
    if (playing) cbs.onPause();
    else cbs.onPlay();
  });
  restart.addEventListener('click', () => cbs.onRestart());
  prev.addEventListener('click', () => cbs.onPrev());
  next.addEventListener('click', () => cbs.onNext());

  host.appendChild(prev);
  host.appendChild(playPause);
  host.appendChild(next);
  host.appendChild(restart);
  host.appendChild(progressWrap);

  return { setPlaying, setProgress };
}

function button(label: string, variant: 'primary' | 'secondary'): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  if (variant === 'primary') b.classList.add('primary');
  return b;
}
