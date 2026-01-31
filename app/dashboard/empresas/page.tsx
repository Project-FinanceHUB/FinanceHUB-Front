'use client'

import { useDashboard } from '@/context/DashboardContext'

export default function EmpresasPage() {
  const { setCompaniesModalOpen } = useDashboard()

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gerenciar empresas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cadastre, edite e gerencie empresas e seus CNPJs. Visualize todas as empresas cadastradas e o histórico completo de gerenciamento.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCompaniesModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Abrir gerenciamento completo
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-gray-200 p-8 shadow-sm text-center">
        <p className="text-gray-500 mb-4">
          Gerencie as informações da sua empresa, visualize contratos e configure detalhes de faturamento.
        </p>
        <button
          type="button"
          onClick={() => setCompaniesModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition"
        >
          Gerenciar empresas
        </button>
      </div>
    </div>
  )
}
