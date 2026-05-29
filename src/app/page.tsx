import { getArticles } from "@/lib/supabase"
import { NewsCardLarge, NewsCardMedium, NewsCardSmall } from "@/components/NewsCard"

export const revalidate = 60

export default async function HomePage() {
  const articles = await getArticles({ limit: 30 }).catch(() => [])

  const featured = articles[0]
  const secondary = articles.slice(1, 4)
  const rest = articles.slice(4)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Destaque principal */}
      {featured && (
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NewsCardLarge article={featured} />
            </div>
            <div className="flex flex-col gap-1">
              {secondary.map((a) => (
                <NewsCardSmall key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-1 h-6 bg-red-600 rounded-full block" />
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Últimas Notícias</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Grid de notícias */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rest.map((a) => (
          <NewsCardMedium key={a.id} article={a} />
        ))}
      </section>

      {articles.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📰</p>
          <p className="font-semibold">Aguardando as primeiras notícias...</p>
          <p className="text-sm mt-1">O pipeline está rodando e as notícias aparecerão em breve.</p>
        </div>
      )}
    </div>
  )
}
