import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Young Sport — Merchant Loyalty',
  description: 'Young Sport - Merchant Loyalty Platform',
  generator: 'v0.app',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,400;1,700;1,800;1,900&family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/young-sport-styles.css" />
        
        {/* Load React and dependencies */}
        <Script
          src="https://unpkg.com/react@18.3.1/umd/react.development.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased" style={{ margin: 0, padding: 0, background: '#0a0a0d' }}>
        {children}
        
        {/* Load app scripts in order */}
        <Script
          src="/young-sport/ios-frame.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        <Script
          src="/young-sport/tweaks-panel.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        <Script
          src="/young-sport/data.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        <Script
          src="/young-sport/ui.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        <Script
          src="/young-sport/screens-main.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        <Script
          src="/young-sport/screens-customer.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        <Script
          src="/young-sport/screens-promo.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        <Script
          src="/young-sport/app.jsx"
          type="text/babel"
          strategy="lazyOnload"
        />
        
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
