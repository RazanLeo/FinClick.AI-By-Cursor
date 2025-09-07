import type { Metadata } from 'next'
import { Inter, Playfair_Display, Tajawal } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const tajawal = Tajawal({ subsets: ['arabic'], weight: ['200', '300', '400', '500', '700', '800', '900'], variable: '--font-tajawal' })

export const metadata: Metadata = {
  title: 'FinClick.AI - Revolutionary Intelligent Financial Analysis Platform',
  description: 'Comprehensive financial analysis platform with 181 analysis types, bilingual reports, and AI-powered insights.',
  keywords: 'financial analysis, AI, business intelligence, reports, Arabic, English',
  authors: [{ name: 'FinClick.AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${playfair.variable} ${tajawal.variable} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
