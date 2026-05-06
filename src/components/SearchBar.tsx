'use client'

import { Search } from 'lucide-react'
import { Locale, t } from '@/lib/i18n'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  locale: Locale
}

export function SearchBar({ value, onChange, locale }: SearchBarProps) {
  return (
    <div className="flex-1 relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(locale, 'search')}
        className="w-full pl-9 pr-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] text-white placeholder:text-[var(--muted)]"
      />
    </div>
  )
}
