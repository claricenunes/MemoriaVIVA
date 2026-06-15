import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import SwRegister from '@/components/pwa/sw-register'
import { FontSizeProvider } from '@/components/accessibility/font-size-provider'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#C4614A',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Memória Viva',
    template: '%s — Memória Viva',
  },
  description: 'Seu companheiro de bem-estar e memória diário',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Memória Viva',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg',     type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'Memória Viva',
    title: 'Memória Viva',
    description: 'Seu companheiro de bem-estar e memória diário',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.1.0/dist/tabler-icons.min.css" />
        {/* Apple splash screens — iOS ignora o manifest para splashes */}
        <link rel="apple-touch-startup-image" href="/splashes/splash-640x1136.png"  media="(device-width:320px) and (device-height:568px) and (-webkit-device-pixel-ratio:2) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-750x1334.png"  media="(device-width:375px) and (device-height:667px) and (-webkit-device-pixel-ratio:2) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1125x2436.png" media="(device-width:375px) and (device-height:812px) and (-webkit-device-pixel-ratio:3) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1170x2532.png" media="(device-width:390px) and (device-height:844px) and (-webkit-device-pixel-ratio:3) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1179x2556.png" media="(device-width:393px) and (device-height:852px) and (-webkit-device-pixel-ratio:3) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1284x2778.png" media="(device-width:428px) and (device-height:926px) and (-webkit-device-pixel-ratio:3) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1290x2796.png" media="(device-width:430px) and (device-height:932px) and (-webkit-device-pixel-ratio:3) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1536x2048.png" media="(device-width:768px) and (device-height:1024px) and (-webkit-device-pixel-ratio:2) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-1668x2388.png" media="(device-width:834px) and (device-height:1194px) and (-webkit-device-pixel-ratio:2) and (orientation:portrait)" />
        <link rel="apple-touch-startup-image" href="/splashes/splash-2048x2732.png" media="(device-width:1024px) and (device-height:1366px) and (-webkit-device-pixel-ratio:2) and (orientation:portrait)" />
      </head>
      <body>
        {children}
        <SwRegister />
        <Toaster position="bottom-center" richColors />
        <FontSizeProvider />
      </body>
    </html>
  )
}
