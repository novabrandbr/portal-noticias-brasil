import { getArticles, CATEGORIES } from "@/lib/supabase"
import { NewsCardMedium } from "@/components/NewsCard"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const revalidate = 120

interface Props {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  const label = CATEGORIES[categoria]
  if (!label) return {}
  return { title: `${label} — Últimas Notícias` }
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params
  const label = CATEGORIES[categoria]
  if (!label) notFound()

  const articles = await getArticles({ category: categoria, limit: 30 }).catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-1 h-8 bg-red-600 rounded-full block" />
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide">{label}</h1>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-400 text-center py-20">Nenhuma notícia nesta categoria ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((a) => (
            <NewsCardMedium key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}
