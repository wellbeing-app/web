const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('inert') && el.offsetParent !== null,
  );
}

/**
 * Traps keyboard focus inside `container` and optionally invokes `onEscape`
 * when the user presses Escape. Returns a cleanup function; call it when the
 * overlay closes to detach listeners and (if `restoreFocusTo` is provided)
 * return focus to the trigger element.
 */
export function trapFocus(
  container: HTMLElement,
  options: { onEscape?: () => void; restoreFocusTo?: HTMLElement | null } = {},
): () => void {
  const { onEscape, restoreFocusTo } = options;

  const initial = getFocusable(container);
  const target = initial[0] ?? container;
  if (!container.hasAttribute('tabindex') && target === container) {
    container.setAttribute('tabindex', '-1');
  }
  target.focus({ preventScroll: true });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = getFocusable(container);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (e.shiftKey && (active === first || !container.contains(active))) {
      e.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  document.addEventListener('keydown', onKeyDown, true);

  return () => {
    document.removeEventListener('keydown', onKeyDown, true);
    restoreFocusTo?.focus({ preventScroll: true });
  };
}
