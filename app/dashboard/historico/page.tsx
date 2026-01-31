'use client'

import { useHistorico } from '@/context/HistoricoContext'

export default function HistoricoPage() {
  const { setHistoricoModalOpen } = useHistorico()

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Histórico</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Boletos e notas fiscais já enviados: protocolos, datas, status e registro completo de ações.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setHistoricoModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Abrir histórico completo
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-gray-200 p-8 shadow-sm text-center">
        <p className="text-gray-500 mb-4">
          Consulte todo o histórico de envios, boletos, notas fiscais e ações do sistema.
        </p>
        <button
          type="button"
          onClick={() => setHistoricoModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition"
        >
          Ver registro completo
        </button>
      </div>
    </div>
  )
}
