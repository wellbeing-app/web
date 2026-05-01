import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Ensure ResizeObserver is available globally in JSDOM
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
if (typeof global !== 'undefined') {
  (global as any).ResizeObserver = ResizeObserverMock;
}
if (typeof window !== 'undefined') {
  (window as any).ResizeObserver = ResizeObserverMock;
}
