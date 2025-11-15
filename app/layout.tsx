import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LTC Price Tracker',
  description: 'Daily Litecoin price tracking and email reports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
