'use client'

import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Avoid hydration mismatch until theme is applied
    return null
  }

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}