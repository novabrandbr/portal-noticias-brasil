import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Portal de Notícias Brasil"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ""

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL || "http://localhost:3000"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Notícias do Brasil atualizadas a cada 5 minutos. Política, economia, esportes, tecnologia e muito mais.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
