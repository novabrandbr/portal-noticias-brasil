import { MetadataRoute } from "next"
import { getArticles, CATEGORIES } from "@/lib/supabase"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles({ limit: 100 }).catch(() => [])

  const articleUrls = articles.map((a) => ({
    url: `${SITE_URL}/noticias/${a.slug}`,
    lastModified: new Date(a.published_at),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }))

  const categoryUrls = Object.keys(CATEGORIES).map((cat) => ({
    url: `${SITE_URL}/categoria/${cat}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.6,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "always", priority: 1 },
    ...categoryUrls,
    ...articleUrls,
  ]
}
