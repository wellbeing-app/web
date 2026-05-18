import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as Sentry from '@sentry/nextjs';

// Lazy-loaded font cache (avoid top-level fetch which fails during Vercel build)
let fontCache: ArrayBuffer | null = null;

async function loadFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const fontPath = join(process.cwd(), 'lib/fonts/GeistMono-Regular.ttf');
  const buffer = await readFile(fontPath);
  fontCache = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  return fontCache;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const lang = searchParams.get('lang') || 'en';

    // Dictionary for translations
    const dictionaries: Record<string, { title: string; description: string }> = {
      en: {
        title: 'Lumi',
        description: 'A calming digital companion for your daily wellbeing journey',
      },
      cs: {
        title: 'Lumi',
        description: 'Uklidňující digitální společník pro vaši každodenní cestu wellbeingem',
      },
    };

    const dict = dictionaries[lang] || dictionaries.en;
    const fontData = await loadFont();

    // Brand colors from design system
    const colors = {
      background: '#EEF3F6',
      primary: '#30363a',
      accent: '#DDE6EC',
      text: '#30363a',
      secondaryText: '#59656d',
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
          🌿 Lumi
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
          lumi.zezulka.me
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
