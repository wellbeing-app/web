import type Lenis from 'lenis';

const FALLBACK_HEADER_OFFSET = 96;
const HEADER_GAP = 16;

export function getSectionTop(element: HTMLElement) {
  return element.getBoundingClientRect().top + window.scrollY;
}

export function getHeaderScrollOffset() {
  const header = document.querySelector('header');
  const rect = header?.getBoundingClientRect();
  return rect ? Math.ceil(rect.top + rect.height + HEADER_GAP) : FALLBACK_HEADER_OFFSET;
}

export function scrollToPageTarget(
  target: HTMLElement | number,
  lenis: Lenis | null,
  options: {
    duration?: number;
    easing?: (t: number) => number;
    lock?: boolean;
    force?: boolean;
  } = {}
) {
  const top =
    typeof target === 'number' ? target : Math.max(0, getSectionTop(target) - getHeaderScrollOffset());

  if (lenis) {
    lenis.scrollTo(top, options);
    return;
  }

  window.scrollTo({
    top,
    behavior: 'smooth',
  });
}
