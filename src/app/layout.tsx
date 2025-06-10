import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gym Buddy - Find Your Workout Partner",
  description: "Connect with gym partners near you and make fitness social",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
          {children}
        </main>
      </body>
    </html>
  )
} 