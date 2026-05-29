import { getArticles } from "@/lib/supabase"
import { NewsCardLarge, NewsCardMedium, NewsCardSmall } from "@/components/NewsCard"
import TrendingTags from "@/components/TrendingTags"
import NewsTicker from "@/components/NewsTicker"
import Newsletter from "@/components/Newsletter"
import Link from "next/link"

export const revalidate = 60

export default async function HomePage() {
  const articles = await getArticles({ limit: 40 }).catch(() => [])

  const featured = articles[0]
  const secondary = articles.slice(1, 4)
  const rest = articles.slice(4, 20)

  const politica = articles.filter(a => a.category === "politica").slice(0, 3)
  const economia = articles.filter(a => a.category === "economia").slice(0, 3)

  const tickerArticles = articles.slice(0, 10).map(a => ({ title: a.title, slug: a.slug, category: a.category }))

  return (
    <>
    <NewsTicker articles={tickerArticles} />
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Destaque principal */}
      {featured && (
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NewsCardLarge article={featured} />
            </div>
            <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
              {secondary.map((a) => (
                <div key={a.id} className="p-1">
                  <NewsCardSmall article={a} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tópicos em Alta */}
      <TrendingTags />

      {/* Últimas Notícias */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-6 bg-red-600 rounded-full block" />
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Últimas Notícias</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-14">
        {rest.map((a) => (
          <NewsCardMedium key={a.id} article={a} />
        ))}
      </section>

      {/* Seção Política */}
      {politica.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-blue-800 rounded-full block" />
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Política</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <Link href="/categoria/politica" className="text-sm text-red-600 font-semibold hover:underline shrink-0">
              Ver tudo →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {politica.map((a) => (
              <NewsCardMedium key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Seção Economia */}
      {economia.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-green-700 rounded-full block" />
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Economia</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <Link href="/categoria/economia" className="text-sm text-red-600 font-semibold hover:underline shrink-0">
              Ver tudo →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {economia.map((a) => (
              <NewsCardMedium key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Banner Instagram */}
      <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-8 text-center text-white mb-8">
        <p className="text-2xl font-black mb-2">🎪 Siga O Circo no Instagram</p>
        <p className="text-sm opacity-90 mb-5">Notícias, política e o maior espetáculo do Brasil direto no seu feed</p>
        <a
          href="https://instagram.com/ocircobr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-pink-600 font-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          @ocircobr →
        </a>
      </section>

      {articles.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🎪</p>
          <p className="font-semibold text-lg">O circo está montando a lona...</p>
          <p className="text-sm mt-2">As primeiras notícias aparecem em breve.</p>
        </div>
      )}

      {/* Newsletter */}
      <Newsletter />
    </div>
    </>
  )
}
