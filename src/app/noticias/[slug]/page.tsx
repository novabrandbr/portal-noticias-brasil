import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getArticleBySlug, getArticles, CATEGORIES } from "@/lib/supabase"
import type { Metadata } from "next"
import { NewsCardSmall } from "@/components/NewsCard"

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.card_image_url ? [article.card_image_url] : [],
      type: "article",
      publishedTime: article.published_at,
    },
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [article, related] = await Promise.all([
    getArticleBySlug(slug),
    getArticles({ limit: 5 }).catch(() => []),
  ])

  if (!article) notFound()

  const relatedArticles = related.filter((a) => a.slug !== slug).slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Artigo principal */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-red-600">Início</Link>
            <span>/</span>
            <Link href={`/categoria/${article.category}`} className="hover:text-red-600">
              {CATEGORIES[article.category] ?? article.category}
            </Link>
          </nav>

          {/* Category tag */}
          <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-600 rounded mb-4">
            {CATEGORIES[article.category] ?? article.category}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">
            {article.summary}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-500 border-y border-gray-200 py-3 mb-6">
            <span className="font-semibold text-gray-700">Fonte: {article.source_name}</span>
            <span>·</span>
            <time>{formatDate(article.published_at)}</time>
          </div>

          {/* Imagem de destaque */}
          {article.card_image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8">
              <Image
                src={article.card_image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          {/* Conteúdo */}
          <div
            className="article-content text-gray-800 text-base sm:text-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Fonte original */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            Notícia originalmente publicada em{" "}
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-red-600 hover:underline font-medium"
            >
              {article.source_name}
            </a>
          </div>

          {/* Compartilhar */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Compartilhar:</p>
            <div className="flex gap-2 flex-wrap">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/noticias/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${article.title} — ${process.env.NEXT_PUBLIC_SITE_URL}/noticias/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-red-600 rounded-full block" />
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Mais Notícias</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              {relatedArticles.map((a) => (
                <NewsCardSmall key={a.id} article={a} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
