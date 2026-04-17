import gsap from 'gsap';

export interface MasterTimelineHandle {
  master: gsap.core.Timeline;
  addChapter: (
    chapterId: string,
    startAt: number | undefined,
    build: (tl: gsap.core.Timeline) => void
  ) => { startTime: number; duration: number };
  seekChapter: (chapterId: string) => void;
  getChapterStart: (chapterId: string) => number | null;
  onChapterChange: (cb: (chapterId: string) => void) => () => void;
  onProgress: (cb: (progress: number) => void) => () => void;
}

interface ChapterEntry {
  id: string;
  start: number;
  end: number;
}

export function createMasterTimeline(): MasterTimelineHandle {
  const master = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
  const chapters: ChapterEntry[] = [];
  const chapterListeners: Array<(id: string) => void> = [];
  const progressListeners: Array<(p: number) => void> = [];
  let currentChapterId: string | null = null;

  const addChapter = (
    chapterId: string,
    startAt: number | undefined,
    build: (tl: gsap.core.Timeline) => void
  ) => {
    const start = startAt !== undefined ? startAt : master.duration();
    const marker = `chapter:${chapterId}`;
    master.addLabel(marker, start);
    const before = master.duration();
    const sub = gsap.timeline({ defaults: { ease: 'power2.out' } });
    build(sub);
    master.add(sub, start);
    const end = Math.max(before, start + sub.duration());
    chapters.push({ id: chapterId, start, end });
    return { startTime: start, duration: sub.duration() };
  };

  const seekChapter = (chapterId: string) => {
    const c = chapters.find((x) => x.id === chapterId);
    if (!c) return;
    master.pause();
    master.seek(c.start, false);
    master.play();
  };

  const getChapterStart = (chapterId: string) => {
    const c = chapters.find((x) => x.id === chapterId);
    return c ? c.start : null;
  };

  master.eventCallback('onUpdate', () => {
    const t = master.time();
    const dur = master.duration() || 1;
    progressListeners.forEach((cb) => cb(Math.min(1, t / dur)));
    // 识别当前章节
    const found = chapters.find((c) => t >= c.start && t < c.end);
    const id = found ? found.id : chapters[chapters.length - 1]?.id ?? null;
    if (id && id !== currentChapterId) {
      currentChapterId = id;
      chapterListeners.forEach((cb) => cb(id));
    }
  });

  const onChapterChange = (cb: (id: string) => void) => {
    chapterListeners.push(cb);
    return () => {
      const i = chapterListeners.indexOf(cb);
      if (i >= 0) chapterListeners.splice(i, 1);
    };
  };

  const onProgress = (cb: (p: number) => void) => {
    progressListeners.push(cb);
    return () => {
      const i = progressListeners.indexOf(cb);
      if (i >= 0) progressListeners.splice(i, 1);
    };
  };

  return {
    master,
    addChapter,
    seekChapter,
    getChapterStart,
    onChapterChange,
    onProgress
  };
}
