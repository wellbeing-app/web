import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { getDictionary } from "@/lib/dictionary";
import { Navbar } from "@/components/navbar";

export async function generateMetadata({ params } : { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang as 'en' | 'cs');
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

const fontVariables = `${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`;

export default async function RootLayout({ 
  children,
  params
}: React.PropsWithChildren<{ params: Promise<{ lang: string }> }>) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang as 'en' | 'cs');
  
  return (
    <html lang={resolvedParams.lang} suppressHydrationWarning>
      {/* 2. FontVariables se přesunuly sem do body */}
      <body className={`${fontVariables} antialiased min-h-screen bg-background text-foreground flex flex-col theme-transition`}>
        {/* 3. Zapnuli jsme disableTransitionOnChange (smazáním ={false}), čímž zmizí FOUC po reloadu */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar dict={dict} lang={resolvedParams.lang} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
