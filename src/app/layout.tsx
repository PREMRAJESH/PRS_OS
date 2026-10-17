import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://premsargara.me'),
  title: 'PRS-OS | Prem Rajesh — AI-Powered Developer Portfolio',
  description: 'A futuristic AI-powered developer operating system portfolio by Prem Rajesh.',
  authors: [{ name: 'Prem Rajesh', url: 'https://premsargara.me' }],
  creator: 'Prem Rajesh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://premsargara.me',
    title: 'PRS-OS | Prem Rajesh — Developer Portfolio',
    description: 'A futuristic AI-powered developer operating system portfolio showcasing high-performance web systems and AI applications.',
    siteName: 'PRS-OS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRS-OS | Prem Rajesh — Developer Portfolio',
    description: 'A futuristic AI-powered developer operating system portfolio.',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0c14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background min-h-screen overflow-hidden" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
