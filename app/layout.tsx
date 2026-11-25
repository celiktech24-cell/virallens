import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'ViralLens',
  description: 'Viral content intelligence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            {children}
          </main>
        </div>
        <style>{`
          .app-shell { display: flex; height: 100vh; overflow: hidden; }
          .app-main  { flex: 1; overflow-y: auto; background: var(--ground); min-width: 0; }
        `}</style>
      </body>
    </html>
  )
}
