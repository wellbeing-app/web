import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const report = await request.json();
    console.log('CSP Violation Report:', JSON.stringify(report, null, 2));

    // In a real application, you might want to send this to a logging service
    // or database. For now, we'll just log it to the server console.

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to parse CSP report:', error);
    return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
  }
}

// Optional: for testing accessibility
export async function GET() {
  return NextResponse.json({ message: 'CSP Reporting Endpoint Active' });
}
