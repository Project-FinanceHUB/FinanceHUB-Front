'use client'

import { useEffect } from 'react'
import type { Solicitacao } from '@/types/solicitacao'
import type { Company } from '@/types/company'
import SolicitacaoForm from './SolicitacaoForm'
import type { SolicitacaoFormData } from '@/types/solicitacao'

type SolicitacaoModalProps = {
  isOpen: boolean
  solicitacao?: Solicitacao
  companies: Company[]
  onClose: () => void
  onSubmit: (data: SolicitacaoFormData) => void
}

export default function SolicitacaoModal({ isOpen, solicitacao, companies, onClose, onSubmit }: SolicitacaoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (data: SolicitacaoFormData) => {
    onSubmit(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {solicitacao ? 'Editar Solicitação' : 'Nova Solicitação'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <SolicitacaoForm solicitacao={solicitacao} companies={companies} onSubmit={handleSubmit} onCancel={onClose} />
        </div>
      </div>
    </div>
  )
}
