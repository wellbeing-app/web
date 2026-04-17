import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: Request) {
  try {
    const report = await request.json();
    const cspReport = report['csp-report'];

    if (cspReport) {
      // Forward to Sentry
      Sentry.withScope((scope) => {
        scope.setLevel('warning');
        scope.setTag('security', 'csp-violation');
        scope.setTag('violated-directive', cspReport['violated-directive']);
        scope.setTag('blocked-uri', cspReport['blocked-uri']);
        scope.setContext('csp_report', cspReport);

        Sentry.captureMessage(
          `CSP Violation: ${cspReport['blocked-uri']} blocked by ${cspReport['violated-directive']}`
        );
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
  }
}

// Optional: for testing accessibility
export async function GET() {
  return NextResponse.json({ message: 'CSP Reporting Endpoint Active' });
}
