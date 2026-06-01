import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getArticleBySlug, getArticles, CATEGORIES, CAT_COLORS, getBestImage, readingTime } from "@/lib/supabase"
import type { Metadata } from "next"
import { NewsCardMedium } from "@/components/NewsCard"
import AdUnit from "@/components/AdUnit"

export const revalidate = 300

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article  = await getArticleBySlug(slug)
  if (!article) return {}
  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocirco.netlify.app"
  const articleUrl = `${siteUrl}/noticias/${article.slug}`
  const heroImage  = getBestImage(article)
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: articleUrl },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: articleUrl,
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.published_at,
      authors: ["O Circo BR"],
      images: heroImage ? [{ url: heroImage, width: 1200, height: 630, alt: article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: heroImage ? [heroImage] : [],
    },
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [article, related] = await Promise.all([
    getArticleBySlug(slug),
    getArticles({ limit: 7 }).catch(() => []),
  ])
  if (!article) notFound()

  const heroImage       = getBestImage(article)
  const mins            = readingTime(article.content)
  const relatedArticles = related.filter(a => a.slug !== slug).slice(0, 4)
  const siteUrl         = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocirco.netlify.app"
  const articleUrl      = `${siteUrl}/noticias/${article.slug}`
  const logoUrl         = `${siteUrl}/logo.png`

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "datePublished": article.published_at,
    "dateModified": article.published_at,
    "url": articleUrl,
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
    "author": { "@type": "Organization", "name": "O Circo BR", "url": siteUrl },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "O Circo BR",
      "url": siteUrl,
      "logo": { "@type": "ImageObject", "url": logoUrl },
    },
    ...(heroImage ? { "image": { "@type": "ImageObject", "url": heroImage, "width": 1200, "height": 630 } } : {}),
    "articleSection": CATEGORIES[article.category] ?? article.category,
    "inLanguage": "pt-BR",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": CATEGORIES[article.category] ?? article.category, "item": `${siteUrl}/categoria/${article.category}` },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": articleUrl },
    ],
  }

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Barra de progresso de leitura */}
      <div id="reading-progress" />
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var el = document.getElementById('reading-progress');
          if(!el) return;
          window.addEventListener('scroll', function(){
            var h = document.documentElement;
            var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            el.style.width = Math.min(100, pct) + '%';
          }, { passive: true });
        })();
      `}} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── ARTIGO PRINCIPAL ────────────────────────────────── */}
          <article className="lg:col-span-2">

            {/* Breadcrumb */}
            <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-red-600 transition-colors">Início</Link>
              <span>/</span>
              <Link href={`/categoria/${article.category}`} className="hover:text-red-600 transition-colors">
                {CATEGORIES[article.category] ?? article.category}
              </Link>
            </nav>

            {/* Categoria */}
            <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-3 ${CAT_COLORS[article.category] ?? "bg-red-600"}`}>
              {CATEGORIES[article.category] ?? article.category}
            </span>

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Resumo */}
            <p className="text-lg text-gray-600 leading-relaxed mb-5 font-medium">
              {article.summary}
            </p>

            {/* Meta: data + tempo de leitura */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 border-y border-gray-200 py-3 mb-6">
              <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
              <span>·</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {mins} min de leitura
              </span>
            </div>

            {/* Imagem de destaque — usa imagem LIMPA (sem overlay do card) */}
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8 shadow-sm">
                <Image
                  src={heroImage} alt={article.title} fill priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}

            {/* Anúncio — antes do conteúdo */}
            <AdUnit slot="SLOT_ARTICLE_TOP" format="horizontal" className="mb-6" />

            {/* Conteúdo */}
            <div
              className="article-content text-gray-800 text-base sm:text-[17px]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Anúncio — depois do conteúdo */}
            <AdUnit slot="SLOT_ARTICLE_BOTTOM" format="rectangle" className="my-6" />


            {/* Compartilhar */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Compartilhar</p>
              <div className="flex gap-2 flex-wrap">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${article.title} — ${articleUrl}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.104 1.523 5.824L0 24l6.335-1.498A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.626 0 11.999 0zm.001 21.818a9.8 9.8 0 01-4.997-1.367l-.358-.213-3.759.888.948-3.658-.234-.376A9.818 9.818 0 012.18 12c0-5.414 4.406-9.818 9.82-9.818S21.819 6.586 21.819 12 17.413 21.818 12 21.818z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X (Twitter)
                </a>
              </div>
            </div>
          </article>

          {/* ── SIDEBAR ─────────────────────────────────────────── */}
          <aside>
            <div className="sticky top-24 space-y-6">

              {/* Mais notícias */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-5 bg-red-600 rounded-full block" />
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Leia também</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 divide-y divide-gray-100">
                  {relatedArticles.map(a => (
                    <NewsCardSmall key={a.id} article={a} />
                  ))}
                </div>
              </div>

              {/* Anúncio sidebar */}
              <AdUnit slot="SLOT_SIDEBAR" format="rectangle" />

              {/* Instagram CTA */}
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-5 text-center text-white">
                <p className="font-black text-base mb-1">🎪 Siga O Circo</p>
                <p className="text-xs opacity-90 mb-3">Notícias ao vivo no Instagram</p>
                <a
                  href="https://instagram.com/ocircobr"
                  target="_blank" rel="noopener noreferrer"
                  className="block bg-white text-pink-600 font-black px-4 py-2 rounded-full text-xs hover:bg-gray-100 transition-colors"
                >
                  @ocircobr →
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ── NOTÍCIAS RELACIONADAS (fundo) ─────────────────────── */}
        {relatedArticles.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-5 bg-red-600 rounded-full block" />
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">Mais Notícias</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedArticles.map(a => (
                <NewsCardMedium key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

// Import para sidebar — NewsCardSmall
import { NewsCardSmall } from "@/components/NewsCard"
