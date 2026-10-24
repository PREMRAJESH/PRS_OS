import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://premsargara.me'),
  title: 'Prem Rajesh — Software Engineer',
  description:
    'Portfolio of Prem Rajesh, a software engineering student in Gujarat building AI systems, full-stack products, and developer tools.',
  authors: [{ name: 'Prem Rajesh', url: 'https://premsargara.me' }],
  creator: 'Prem Rajesh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://premsargara.me',
    title: 'Prem Rajesh — Software Engineer',
    description:
      'AI systems, full-stack products, and developer tools by Prem Rajesh.',
    siteName: 'Prem Rajesh',
    images: [{ url: '/avatar.jpg', width: 1254, height: 1254, alt: 'Prem Rajesh' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prem Rajesh — Software Engineer',
    description: 'AI systems, full-stack products, and developer tools.',
    images: ['/avatar.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#151310',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background min-h-screen overflow-hidden" suppressHydrationWarning>
        <a
          href="#workspace"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
