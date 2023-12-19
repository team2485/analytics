import { Inter } from 'next/font/google'
import './globals.css'

import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Team 2485 Analytics App',
  description: 'For scouting and analysis of the FIRST game.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  )
}
