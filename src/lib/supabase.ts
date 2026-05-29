import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Article {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  category: string
  source_name: string
  source_url: string
  card_image_url?: string
  published_at: string
  created_at: string
}

export const CATEGORIES: Record<string, string> = {
  geral: "Geral",
  politica: "Política",
  economia: "Economia",
  esportes: "Esportes",
  tecnologia: "Tecnologia",
  entretenimento: "Entretenimento",
}

export async function getArticles(opts: {
  category?: string
  limit?: number
  offset?: number
}): Promise<Article[]> {
  let query = supabase
    .from("articles")
    .select("id,slug,title,summary,category,source_name,card_image_url,published_at")
    .order("published_at", { ascending: false })
    .limit(opts.limit ?? 20)

  if (opts.category) query = query.eq("category", opts.category)
  if (opts.offset) query = query.range(opts.offset, opts.offset + (opts.limit ?? 20) - 1)

  const { data, error } = await query
  if (error) throw error
  return (data as Article[]) ?? []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single()
  return (data as Article) ?? null
}
