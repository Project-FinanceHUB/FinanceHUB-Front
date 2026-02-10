'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useConfiguracoes } from '@/context/ConfiguracoesContext'
import { SkeletonCard } from '@/components/Skeleton'
import type { User, UserFormData, UserRole } from '@/types/configuracoes'
import UserModal from '@/components/UserModal'

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'usuario', label: 'Usuário' },
]

export default function UsuariosPage() {
  const router = useRouter()
  const { users, addUser, updateUser, deleteUser, loading, error } = useConfiguracoes()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users
    const term = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.nome.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    )
  }, [users, searchTerm])

  const handleAddUser = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await deleteUser(id)
      } catch (err: any) {
        console.error('Erro ao deletar usuário:', err)
        alert(err.message || 'Erro ao deletar usuário')
      }
    }
  }

  const handleSaveUser = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data)
      } else {
        await addUser(data)
      }
      setIsModalOpen(false)
      setEditingUser(null)
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err)
      alert(err.message || 'Erro ao salvar usuário')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return 'Nunca'
    }
  }

  const getRoleLabel = (role: UserRole) => {
    return ROLES.find((r) => r.value === role)?.label || role
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Voltar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddUser}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-amber-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Usuário
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome ou email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 custom:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {/* Users Grid */}
      {!loading && filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Nenhum usuário encontrado.' : 'Nenhum usuário cadastrado.'}
          </p>
          {!searchTerm && (
            <button
              type="button"
              onClick={handleAddUser}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar primeiro usuário
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 custom:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.nome}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Tipo:</span>
                  <span className="font-medium text-gray-900">{getRoleLabel(user.role)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Status:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${user.ativo ? 'bg-green-500' : 'bg-gray-400'}`}
                    />
                    <span className={`font-medium ${user.ativo ? 'text-green-700' : 'text-gray-500'}`}>
                      {user.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Último login:</span>
                  <span className="text-gray-700">{formatDate(user.ultimoLogin)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleEditUser(user)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false)
            setEditingUser(null)
          }}
          onSave={handleSaveUser}
          onDelete={editingUser ? () => handleDeleteUser(editingUser.id) : undefined}
        />
      )}
    </div>
  )
}
