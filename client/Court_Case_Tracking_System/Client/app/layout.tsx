import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/LanguageContext'
import { Header } from '@/components/Header'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const sourceSans = Source_Sans_3({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NyaySetu - Understand, Prepare & Track Your Court Case',
  description: 'NyaySetu is a bilingual citizen-first platform that simplifies court case tracking using clear timelines, document guidance, reminders, and access to lawyers.',
  keywords: ['court case', 'legal', 'India', 'case tracking', 'lawyers', 'legal help', 'Hindi', 'English'],
  authors: [{ name: 'NyaySetu' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#8b6f47',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-[var(--beige-soft)]`}>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
