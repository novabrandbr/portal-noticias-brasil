"use client"
import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      // Salva via Supabase edge function ou endpoint próprio
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setStatus("ok")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-12 text-white my-14">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-4xl mb-4">🎪</div>
        <h2 className="text-2xl md:text-3xl font-black mb-3">
          Receba as notícias mais quentes do dia
        </h2>
        <p className="text-gray-400 mb-8 text-sm md:text-base">
          Cadastre seu e-mail e receba um resumo diário com as principais notícias do Circo — sem spam, só o que importa.
        </p>

        {status === "ok" ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 font-semibold">
            ✅ Perfeito! Você está na lista. Fique atento ao seu e-mail.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm shrink-0 disabled:opacity-60"
            >
              {status === "loading" ? "Cadastrando..." : "Quero receber →"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-sm mt-3">Erro ao cadastrar. Tente novamente.</p>
        )}
        <p className="text-gray-600 text-xs mt-4">Sem spam. Cancele quando quiser.</p>
      </div>
    </section>
  )
}
