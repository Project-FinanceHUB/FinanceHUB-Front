'use client'

import { useRouter } from 'next/navigation'
import { useDashboard } from '@/context/DashboardContext'
import { useConfiguracoes } from '@/context/ConfiguracoesContext'

function Icon({ name, className }: { name: string; className?: string }) {
  const cls = `w-8 h-8 ${className ?? ''}`
  switch (name) {
    case 'users':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    case 'user':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'lock':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    case 'companies':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    default:
      return null
  }
}

const CARDS = [
  { id: 'perfil', title: 'Perfil', description: 'Atualize seus dados pessoais e informações de contato.', icon: 'user' },
]

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { setCompaniesModalOpen } = useDashboard()
  const { setConfiguracoesModalOpen, setConfiguracoesModalTab } = useConfiguracoes()

  const openConfigModal = (tabId: string) => {
    setConfiguracoesModalTab(tabId)
    setConfiguracoesModalOpen(true)
  }

  const handleUsuariosClick = () => {
    router.push('/dashboard/usuarios')
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Gerenciamento de usuários e perfil.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={handleUsuariosClick}
          className="text-left rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
            <Icon name="users" />
          </div>
          <h3 className="font-semibold text-gray-900">Gerenciamento de usuários</h3>
          <p className="text-sm text-gray-500 mt-1">Adicione, edite e remova usuários da plataforma.</p>
        </button>

        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => openConfigModal(card.id)}
            className="text-left rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
              <Icon name={card.icon} />
            </div>
            <h3 className="font-semibold text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setCompaniesModalOpen(true)}
          className="text-left rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
            <Icon name="companies" />
          </div>
          <h3 className="font-semibold text-gray-900">Gerenciar empresas</h3>
          <p className="text-sm text-gray-500 mt-1">Cadastre e gerencie as empresas vinculadas.</p>
        </button>
      </div>
    </div>
  )
}
