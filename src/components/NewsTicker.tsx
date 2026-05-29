"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

interface TickerArticle { title: string; slug: string; category: string }

export default function NewsTicker({ articles }: { articles: TickerArticle[] }) {
  const [pos, setPos] = useState(0)

  useEffect(() => {
    if (!articles.length) return
    const interval = setInterval(() => setPos((p) => (p + 1) % articles.length), 4000)
    return () => clearInterval(interval)
  }, [articles.length])

  if (!articles.length) return null
  const article = articles[pos]

  return (
    <div className="bg-red-600 text-white text-sm py-2 px-4 flex items-center gap-3 overflow-hidden">
      <span className="shrink-0 font-black uppercase tracking-wider text-xs bg-white text-red-600 px-2 py-0.5 rounded">
        🔴 AO VIVO
      </span>
      <div className="flex-1 overflow-hidden">
        <Link
          href={`/noticias/${article.slug}`}
          className="hover:underline font-semibold truncate block transition-all duration-500"
        >
          {article.title}
        </Link>
      </div>
      <span className="shrink-0 text-red-200 text-xs">
        {pos + 1}/{articles.length}
      </span>
    </div>
  )
}
