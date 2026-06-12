import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memória Viva',
  description: 'Seu companheiro de memória e bem-estar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.1.0/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
