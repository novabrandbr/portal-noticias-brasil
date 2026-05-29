"use client"
import Link from "next/link"
import { CATEGORIES } from "@/lib/supabase"

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Portal de Notícias"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block w-1 h-8 bg-red-600 rounded-full" />
            <span className="text-2xl font-black text-gray-900 tracking-tight">{SITE_NAME}</span>
          </Link>
          <span className="text-xs text-gray-400 hidden sm:block">
            Notícias atualizadas a cada 5 minutos
          </span>
        </div>

        {/* Categories nav */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          <Link
            href="/"
            className="shrink-0 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            Todas
          </Link>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <Link
              key={key}
              href={`/categoria/${key}`}
              className="shrink-0 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
