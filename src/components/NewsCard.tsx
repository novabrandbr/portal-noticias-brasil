import Link from "next/link"
import Image from "next/image"
import { Article, CATEGORIES, CAT_COLORS, getBestImage } from "@/lib/supabase"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return "agora"
  if (mins < 60) return `há ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `há ${hrs}h`
  return `há ${Math.floor(hrs / 24)}d`
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[11px] font-bold text-white rounded ${CAT_COLORS[category] ?? "bg-red-600"}`}>
      {CATEGORIES[category] ?? category}
    </span>
  )
}

// ── Card Grande (destaque principal) ────────────────────────────────────────
export function NewsCardLarge({ article }: { article: Article }) {
  const img = getBestImage(article)
  return (
    <Link href={`/noticias/${article.slug}`} className="group block card-hover">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200">
        {img ? (
          <Image
            src={img} alt={article.title} fill priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-white text-5xl opacity-20">🎪</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <CategoryBadge category={article.category} />
          <h2 className="text-white font-black text-xl sm:text-2xl leading-tight mt-2 group-hover:text-red-300 transition-colors line-clamp-3">
            {article.title}
          </h2>
          <p className="text-gray-300 text-xs mt-2">{timeAgo(article.published_at)}</p>
        </div>
      </div>
    </Link>
  )
}

// ── Card Pequeno (sidebar / secundário) ──────────────────────────────────────
export function NewsCardSmall({ article }: { article: Article }) {
  const img = getBestImage(article)
  return (
    <Link href={`/noticias/${article.slug}`} className="group flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
        {img ? (
          <Image src={img} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">🎪</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <CategoryBadge category={article.category} />
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mt-1">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{timeAgo(article.published_at)}</p>
      </div>
    </Link>
  )
}

// ── Card Médio (grid de notícias) ────────────────────────────────────────────
export function NewsCardMedium({ article }: { article: Article }) {
  const img = getBestImage(article)
  return (
    <Link href={`/noticias/${article.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm card-hover">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
        {img ? (
          <Image
            src={img} alt={article.title} fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-gray-500 text-2xl">🎪</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <CategoryBadge category={article.category} />
        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mt-1.5 text-sm">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1.5">{timeAgo(article.published_at)}</p>
      </div>
    </Link>
  )
}

// ── Card Horizontal (lista) ──────────────────────────────────────────────────
export function NewsCardHorizontal({ article }: { article: Article }) {
  const img = getBestImage(article)
  return (
    <Link href={`/noticias/${article.slug}`} className="group flex gap-4 bg-white rounded-xl overflow-hidden shadow-sm card-hover p-3">
      <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
        {img ? (
          <Image src={img} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="112px" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <CategoryBadge category={article.category} />
        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm leading-snug mt-1">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{timeAgo(article.published_at)}</p>
      </div>
    </Link>
  )
}
