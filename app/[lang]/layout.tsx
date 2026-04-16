import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare } from 'geist/font/pixel';
import { ThemeProvider } from '@/components/theme-provider';
import '../globals.css';
import { getDictionary } from '@/lib/dictionary';
import { Navbar } from '@/components/navbar';
import { DictionaryProvider } from '@/components/providers/dictionary-provider';

const baseUrl = 'https://wellbeing.zezulka.me';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Wellbeing App',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  sameAs: ['https://www.linkedin.com/company/wellbeing-app', 'https://twitter.com/wellbeingapp'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+420-123-456-789',
    contactType: 'customer service',
    areaServed: 'CZ',
    availableLanguage: ['English', 'Czech'],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'cs';
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(baseUrl),
    title: dict.metadata.title,
    description: dict.metadata.description,
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      type: 'website',
      locale: lang === 'en' ? 'en_US' : 'cs_CZ',
      url: baseUrl,
      siteName: 'Wellbeing App',
      images: [
        {
          url: `${baseUrl}/og-image.png?lang=${lang}`,
          width: 1200,
          height: 630,
          alt: dict.metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@wellbeingapp',
      creator: '@wellbeingapp',
      title: dict.metadata.title,
      description: dict.metadata.description,
      images: [`${baseUrl}/og-image.png?lang=${lang}`],
    },
  };
}

const fontVariables = `${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`;

export default async function RootLayout({
  children,
  params,
}: React.PropsWithChildren<{ params: Promise<{ lang: string }> }>) {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as 'en' | 'cs');

  return (
    <html lang={resolvedParams.lang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${fontVariables} antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <DictionaryProvider dictionary={dictionary}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a href="#main-content" className="sr-only">
              {dictionary.accessibility.skipToMain}
            </a>
            <Navbar lang={resolvedParams.lang} />
            {children}
          </ThemeProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}
