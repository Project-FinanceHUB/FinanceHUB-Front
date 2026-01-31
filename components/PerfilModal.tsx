'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useConfiguracoes } from '@/context/ConfiguracoesContext'
import { useToast } from '@/context/ToastContext'

type PerfilModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function PerfilModal({ isOpen, onClose }: PerfilModalProps) {
  const { user } = useAuth()
  const { profile, setProfile } = useConfiguracoes()
  const toast = useToast()
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar com dados do usuário autenticado ao abrir
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        nome: user.nome || profile.nome || '',
        email: user.email || profile.email || '',
        telefone: profile.telefone || '',
        cargo: profile.cargo || '',
      })
    }
  }, [isOpen, user, profile])

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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Atualizar o perfil no contexto
      setProfile({
        ...profile,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: formData.cargo,
      })
      
      // TODO: Aqui você pode adicionar uma chamada à API para salvar o perfil no backend
      // await userAPI.updateProfile(user?.id, formData)
      
      toast.success('Perfil atualizado com sucesso!')
      onClose()
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const inputBase = 'w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-white border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40'
  const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Meu Perfil</h2>
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                className={inputBase}
                placeholder="Seu nome"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={inputBase}
                placeholder="seu@email.com"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">O e-mail não pode ser alterado</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                className={inputBase}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData((prev) => ({ ...prev, cargo: e.target.value }))}
                className={inputBase}
                placeholder="Ex: Cliente"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={btnPrimary}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
