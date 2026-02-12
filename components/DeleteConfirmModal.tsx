'use client'

import { useEffect, useState } from 'react'
import LoadingButton from './LoadingButton'

type DeleteConfirmModalProps = {
  isOpen: boolean
  solicitacaoNumero: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function DeleteConfirmModal({
  isOpen,
  solicitacaoNumero,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsDeleting(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Content */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg
              className="w-6 h-6 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Confirmar exclusão
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Tem certeza que deseja excluir a solicitação <strong>#{solicitacaoNumero}</strong>? Esta ação não pode ser desfeita.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <LoadingButton
              type="button"
              onClick={handleConfirm}
              isLoading={isDeleting}
              variant="danger"
              className="flex-1 py-2.5 min-h-[44px]"
            >
              Excluir
            </LoadingButton>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50 min-h-[44px]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
