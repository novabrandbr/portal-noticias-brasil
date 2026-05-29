import Link from "next/link"
import Image from "next/image"
import { Article, CATEGORIES } from "@/lib/supabase"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "agora"
  if (mins < 60) return `há ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `há ${hrs}h`
  return `há ${Math.floor(hrs / 24)}d`
}

const CAT_COLORS: Record<string, string> = {
  geral: "bg-red-600",
  politica: "bg-blue-800",
  economia: "bg-green-700",
  esportes: "bg-orange-500",
  tecnologia: "bg-sky-600",
  entretenimento: "bg-purple-600",
}

export function NewsCardLarge({ article }: { article: Article }) {
  return (
    <Link href={`/noticias/${article.slug}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
        {article.card_image_url ? (
          <Image
            src={article.card_image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-white text-4xl font-black opacity-20">N</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <span className={`inline-block px-2 py-0.5 text-xs font-bold text-white rounded mb-2 ${CAT_COLORS[article.category] ?? "bg-red-600"}`}>
            {CATEGORIES[article.category] ?? article.category}
          </span>
          <h2 className="text-white font-bold text-xl leading-tight group-hover:text-red-300 transition-colors line-clamp-3">
            {article.title}
          </h2>
          <p className="text-gray-300 text-xs mt-1">{article.source_name} · {timeAgo(article.published_at)}</p>
        </div>
      </div>
    </Link>
  )
}

export function NewsCardSmall({ article }: { article: Article }) {
  return (
    <Link href={`/noticias/${article.slug}`} className="group flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {article.card_image_url ? (
          <Image
            src={article.card_image_url}
            alt={article.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`inline-block px-1.5 py-0.5 text-xs font-bold text-white rounded mb-1 ${CAT_COLORS[article.category] ?? "bg-red-600"}`}>
          {CATEGORIES[article.category] ?? article.category}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{article.source_name} · {timeAgo(article.published_at)}</p>
      </div>
    </Link>
  )
}

export function NewsCardMedium({ article }: { article: Article }) {
  return (
    <Link href={`/noticias/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-2">
        {article.card_image_url ? (
          <Image
            src={article.card_image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
      </div>
      <span className={`inline-block px-2 py-0.5 text-xs font-bold text-white rounded mb-1 ${CAT_COLORS[article.category] ?? "bg-red-600"}`}>
        {CATEGORIES[article.category] ?? article.category}
      </span>
      <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
        {article.title}
      </h3>
      <p className="text-xs text-gray-400 mt-1">{article.source_name} · {timeAgo(article.published_at)}</p>
    </Link>
  )
}
