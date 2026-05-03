import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CampusWe — Her büyük startup bir eksiklikle başladı',
  description: 'Eksikliği olan girişimcilerin birbirini bulup projelerini hayata geçirdiği platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
