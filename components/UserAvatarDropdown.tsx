'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

type UserAvatarDropdownProps = {
  isOpen: boolean
  onClose: () => void
}

export default function UserAvatarDropdown({ isOpen, onClose }: UserAvatarDropdownProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      onClose()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (!isOpen) return null

  const userInitial = user?.nome?.charAt(0).toUpperCase() || 'U'
  const userRoleLabels: Record<string, string> = {
    admin: 'Administrador',
    gerente: 'Gerente',
    usuario: 'Usuário',
    cliente: 'Cliente',
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
    >
      {/* Header do dropdown */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white flex items-center justify-center font-semibold text-sm">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {user?.nome || 'Usuário'}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.email || ''}
            </div>
            {user?.role && (
              <div className="text-xs text-[var(--primary)] font-medium mt-0.5">
                {userRoleLabels[user.role] || user.role}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => {
            router.push('/dashboard/configuracoes')
            onClose()
          }}
          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Configurações</span>
        </button>

        <div className="border-t border-gray-200 my-1" />

        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}
