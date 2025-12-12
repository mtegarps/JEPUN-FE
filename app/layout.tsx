import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '日本語学習 | Japanese E-Learning',
  description: 'Learn Japanese with AI-powered interactive lessons',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(255, 183, 197, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#FFB7C5',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
