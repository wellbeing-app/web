import { useCallback, useSyncExternalStore } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

/**
 * Returns true when the viewport matches the desktop breakpoint (≥768px).
 *
 * SSR note: the server snapshot defaults to `true` (desktop) to match the
 * historical behavior of the duplicated hooks this consolidates. Client
 * mount then reconciles against the actual media query. Components using
 * this should pair with `suppressHydrationWarning` if the rendered tree
 * differs between desktop and mobile paths.
 */
export function useIsDesktop(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  }, []);
  const getSnapshot = useCallback(
    () => window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
    [],
  );
  const getServerSnapshot = useCallback(() => true, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
