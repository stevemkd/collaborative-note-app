// components/ThemeToggle.tsx
'use client'

import { Button } from '@heroui/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      isIconOnly
      variant="light"
      className="fixed bottom-6 right-6 w-12 h-12 rounded-2xl shadow-xl border border-default-200 backdrop-blur-xl z-50"
      onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  )
}
