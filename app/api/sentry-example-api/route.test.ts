import { describe, expect, it, vi } from 'vitest';
import { GET } from './route';

// Mock the Sentry module to verify the logger is called
vi.mock('@sentry/nextjs', () => ({
  logger: {
    info: vi.fn(),
  },
}));

describe('Sentry Example API', () => {
  it('should call Sentry.logger.info and throw SentryExampleAPIError', async () => {
    // Import Sentry dynamically so it uses the mock we set up above
    const Sentry = await import('@sentry/nextjs');

    // We expect the function to throw, so we catch the error to inspect it
    let caughtError: unknown;
    try {
      GET();
    } catch (error) {
      caughtError = error;
    }

    // Verify the error was thrown and has the correct properties
    expect(caughtError).toBeDefined();
    expect(caughtError).toBeInstanceOf(Error);
    expect((caughtError as Error).name).toBe('SentryExampleAPIError');
    expect((caughtError as Error).message).toBe(
      'This error is raised on the backend called by the example page.'
    );

    // Verify Sentry.logger.info was called correctly
    expect(Sentry.logger.info).toHaveBeenCalledWith('Sentry example API called');
    expect(Sentry.logger.info).toHaveBeenCalledTimes(1);
  });
});
