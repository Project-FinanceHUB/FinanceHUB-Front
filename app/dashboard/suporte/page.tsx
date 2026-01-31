'use client'

import { useSuporte } from '@/context/SuporteContext'

export default function SuportePage() {
  const { setSuporteModalOpen, setSuporteModalTab, mensagens } = useSuporte()
  const naoLidas = mensagens.filter((m) => !m.lida).length

  const handleAbrirSuporte = () => {
    if (naoLidas > 0) setSuporteModalTab('inbox')
    setSuporteModalOpen(true)
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Suporte</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Envie mensagens, visualize a caixa de entrada e o histórico de atendimento e solicitações.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAbrirSuporte}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Abrir suporte
          {naoLidas > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-rose-500 rounded-full">
              {naoLidas}
            </span>
          )}
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Central de atendimento</h2>
          <p className="text-sm text-gray-500 mb-6">
            Envie mensagens, acompanhe suas solicitações e visualize o histórico completo de atendimento.
          </p>
          <button
            type="button"
            onClick={handleAbrirSuporte}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition"
          >
            Abrir suporte
          </button>
        </div>
      </div>
    </div>
  )
}
