import Link from "next/link"
import { CATEGORIES } from "@/lib/supabase"

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Portal de Notícias"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
              <span className="text-white font-black text-xl">{SITE_NAME}</span>
            </div>
            <p className="text-sm max-w-xs">
              Notícias do Brasil atualizadas automaticamente a cada 5 minutos, 24 horas por dia.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Categorias</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <Link
                  key={key}
                  href={`/categoria/${key}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-center">
          © {new Date().getFullYear()} {SITE_NAME}. As notícias são reescritas com IA a partir de fontes públicas.
        </div>
      </div>
    </footer>
  )
}
