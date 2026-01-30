'use client'

import { useDashboard } from '@/context/DashboardContext'

export default function ConfiguracoesPage() {
  const { setCompaniesModalOpen } = useDashboard()

  return (
    <div className="px-4 sm:px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Gerenciamento de usuários, perfil, preferências da conta, segurança e permissões.
        </p>
      </div>
      <div className="mt-8 rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
        <p className="text-gray-500 mb-4">Tela em construção. Enquanto isso, você pode gerenciar suas empresas:</p>
        <button
          type="button"
          onClick={() => setCompaniesModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
        >
          Gerenciar empresas
        </button>
      </div>
    </div>
  )
}
