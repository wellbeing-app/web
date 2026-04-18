import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import * as Sentry from '@sentry/nextjs';

// Mock Sentry
const mockScope = {
  setLevel: vi.fn(),
  setTag: vi.fn(),
  setContext: vi.fn(),
};

vi.mock('@sentry/nextjs', () => ({
  withScope: vi.fn((callback) => {
    callback(mockScope);
  }),
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}));

describe('CSP Report API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should forward a valid CSP report to Sentry and return 200', async () => {
      const mockReport = {
        'csp-report': {
          'document-uri': 'http://example.com',
          'violated-directive': 'script-src',
          'blocked-uri': 'http://evil.com/script.js',
        },
      };

      const request = new Request('http://localhost/api/csp-report', {
        method: 'POST',
        body: JSON.stringify(mockReport),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ received: true });

      // Verify Sentry calls
      expect(Sentry.withScope).toHaveBeenCalledTimes(1);

      expect(mockScope.setLevel).toHaveBeenCalledWith('warning');
      expect(mockScope.setTag).toHaveBeenCalledWith('security', 'csp-violation');
      expect(mockScope.setTag).toHaveBeenCalledWith('violated-directive', 'script-src');
      expect(mockScope.setTag).toHaveBeenCalledWith('blocked-uri', 'http://evil.com/script.js');
      expect(mockScope.setContext).toHaveBeenCalledWith('csp_report', mockReport['csp-report']);

      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        'CSP Violation: http://evil.com/script.js blocked by script-src'
      );
    });

    it('should return 200 without calling Sentry if csp-report key is missing', async () => {
      const request = new Request('http://localhost/api/csp-report', {
        method: 'POST',
        body: JSON.stringify({ other: 'data' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ received: true });
      expect(Sentry.withScope).not.toHaveBeenCalled();
      expect(Sentry.captureMessage).not.toHaveBeenCalled();
    });

    it('should catch JSON parsing errors, capture exception with Sentry, and return 400', async () => {
      const request = new Request('http://localhost/api/csp-report', {
        method: 'POST',
        body: 'invalid-json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid report' });
      expect(Sentry.captureException).toHaveBeenCalledTimes(1);
      expect(Sentry.withScope).not.toHaveBeenCalled();
      expect(Sentry.captureMessage).not.toHaveBeenCalled();
    });
  });

  describe('GET', () => {
    it('should return a success message', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: 'CSP Reporting Endpoint Active' });
    });
  });
});
