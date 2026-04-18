import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';

const fontRegular = fetch(new URL('../../lib/fonts/GeistMono-Regular.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const lang = searchParams.get('lang') || 'en';

    // Dictionary for translations
    const dictionaries: Record<string, { title: string; description: string }> = {
      en: {
        title: 'Wellbeing App',
        description: 'A calming digital companion for your daily wellbeing journey',
      },
      cs: {
        title: 'Wellbeing App',
        description: 'Uklidňující digitální společník pro vaši každodenní cestu wellbeingem',
      },
    };

    const dict = dictionaries[lang] || dictionaries.en;
    const fontData = await fontRegular;

    // Brand colors from design system
    const colors = {
      background: '#F0EEE9',
      primary: '#363533',
      accent: '#e2dfd8',
      text: '#363533',
      secondaryText: '#5c5a57',
    };

    return new ImageResponse(
      <div
        style={{
          backgroundColor: colors.background,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Geist Mono, sans-serif',
          padding: '80px',
          boxSizing: 'border-box',
        }}
      >
        {/* Background pattern - subtle geometric */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '200px',
            height: '200px',
            backgroundColor: colors.accent,
            opacity: 0.5,
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '160px',
            height: '160px',
            backgroundColor: colors.accent,
            opacity: 0.4,
            borderRadius: '50%',
          }}
        />

        {/* Logo - stylized text */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: '40px',
            letterSpacing: '-2px',
          }}
        >
          🌿 Wellbeing
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          {dict.title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '32px',
            color: colors.secondaryText,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.5',
          }}
        >
          {dict.description}
        </div>

        {/* Footer with URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '24px',
            color: colors.secondaryText,
          }}
        >
          wellbeing.zezulka.me
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Geist Mono',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    Sentry.captureException(error, {
      extra: { message: 'Error generating OG image' },
    });
    return new Response('Failed to generate OG image', { status: 500 });
  }
}

export const runtime = 'nodejs';
