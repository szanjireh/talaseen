import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Talaseen - Iranian Gold Marketplace',
  description: 'Premium gold jewelry marketplace featuring Iranian gold sellers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
