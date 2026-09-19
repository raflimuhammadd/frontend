import { ReactNode } from 'react'
import { AuthProvider } from '@/presentation/providers/auth.provider'
import './globals.css'

export const metadata = {
  title: 'Task Management System',
  description: 'Operational backbone for managing project deliverables',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
