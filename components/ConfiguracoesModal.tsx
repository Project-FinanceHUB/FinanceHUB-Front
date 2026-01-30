'use client'

import { useEffect, useState } from 'react'
import { useConfiguracoes } from '@/context/ConfiguracoesContext'
import type { User, UserFormData, UserRole, Permission, PermissionFormData } from '@/types/configuracoes'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

const TABS = [
  { id: 'usuarios', label: 'Usuários' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'preferencias', label: 'Preferências' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'permissoes', label: 'Permissões' },
]

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'usuario', label: 'Usuário' },
]

export default function ConfiguracoesModal() {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    profile,
    setProfile,
    preferences,
    setPreferences,
    permissions,
    addPermission,
    updatePermission,
    deletePermission,
    configuracoesModalOpen,
    setConfiguracoesModalOpen,
    configuracoesModalTab,
    setConfiguracoesModalTab,
  } = useConfiguracoes()

  const [userForm, setUserForm] = useState<UserFormData>({
    nome: '',
    email: '',
    role: 'usuario',
    ativo: true,
  })
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [userErrors, setUserErrors] = useState<Record<string, string>>({})

  const [permForm, setPermForm] = useState<PermissionFormData>({
    chave: '',
    descricao: '',
    ativo: true,
  })
  const [editingPermId, setEditingPermId] = useState<string | null>(null)

  useEffect(() => {
    if (configuracoesModalOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [configuracoesModalOpen])

  useEffect(() => {
    if (!configuracoesModalOpen) {
      setEditingUserId(null)
      setUserForm({ nome: '', email: '', role: 'usuario', ativo: true })
      setUserErrors({})
      setEditingPermId(null)
      setPermForm({ chave: '', descricao: '', ativo: true })
    }
  }, [configuracoesModalOpen])

  if (!configuracoesModalOpen) return null

  const handleClose = () => setConfiguracoesModalOpen(false)

  const validateUser = () => {
    const err: Record<string, string> = {}
    if (!userForm.nome.trim()) err.nome = 'Nome é obrigatório'
    if (!userForm.email.trim()) err.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) err.email = 'E-mail inválido'
    setUserErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSaveUser = () => {
    if (!validateUser()) return
    if (editingUserId) {
      updateUser(editingUserId, userForm)
      setEditingUserId(null)
    } else {
      addUser(userForm)
    }
    setUserForm({ nome: '', email: '', role: 'usuario', ativo: true })
    setUserErrors({})
  }

  const handleEditUser = (u: User) => {
    setEditingUserId(u.id)
    setUserForm({ nome: u.nome, email: u.email, role: u.role, ativo: u.ativo })
    setUserErrors({})
  }

  const handleDeleteUser = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Remover este usuário?')) return
    deleteUser(id)
    if (editingUserId === id) {
      setEditingUserId(null)
      setUserForm({ nome: '', email: '', role: 'usuario', ativo: true })
    }
  }

  const handleSaveProfile = () => {
    setProfile({ ...profile })
  }

  const handleSavePreferences = () => {
    setPreferences({ ...preferences })
  }

  const handleSavePermission = () => {
    if (!permForm.chave.trim() || !permForm.descricao.trim()) return
    if (editingPermId) {
      updatePermission(editingPermId, permForm)
      setEditingPermId(null)
    } else {
      addPermission(permForm)
    }
    setPermForm({ chave: '', descricao: '', ativo: true })
  }

  const handleEditPermission = (p: Permission) => {
    setEditingPermId(p.id)
    setPermForm({ chave: p.chave, descricao: p.descricao, ativo: p.ativo })
  }

  const handleDeletePermission = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Remover esta permissão?')) return
    deletePermission(id)
    if (editingPermId === id) {
      setEditingPermId(null)
      setPermForm({ chave: '', descricao: '', ativo: true })
    }
  }

  const inputBase = 'w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-white border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40'
  const inputError = 'border-red-300'
  const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition'
  const btnSecondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setConfiguracoesModalTab(tab.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap transition',
                configuracoesModalTab === tab.id
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--secondary)]/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {configuracoesModalTab === 'usuarios' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Usuários cadastrados</h3>
                {users.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum usuário cadastrado.</p>
                ) : (
                  <ul className="space-y-2">
                    {users.map((u) => (
                      <li
                        key={u.id}
                        className={cn(
                          'rounded-xl border px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer hover:bg-gray-50',
                          editingUserId === u.id ? 'border-[var(--primary)] bg-[var(--secondary)]/40' : 'border-gray-200'
                        )}
                        onClick={() => handleEditUser(u)}
                      >
                        <div>
                          <div className="font-semibold text-gray-900">{u.nome}</div>
                          <div className="text-xs text-gray-500">{u.email} • {ROLES.find(r => r.value === u.role)?.label}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id) }}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">{editingUserId ? 'Editar usuário' : 'Novo usuário'}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      value={userForm.nome}
                      onChange={(e) => setUserForm((f) => ({ ...f, nome: e.target.value }))}
                      className={cn(inputBase, userErrors.nome && inputError)}
                      placeholder="Nome completo"
                    />
                    {userErrors.nome && <p className="mt-1 text-xs text-red-600">{userErrors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                      className={cn(inputBase, userErrors.email && inputError)}
                      placeholder="email@exemplo.com"
                    />
                    {userErrors.email && <p className="mt-1 text-xs text-red-600">{userErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                      className={inputBase}
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userForm.ativo}
                      onChange={(e) => setUserForm((f) => ({ ...f, ativo: e.target.checked }))}
                      className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm text-gray-700">Usuário ativo</span>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={handleSaveUser} className={btnPrimary}>
                      {editingUserId ? 'Salvar' : 'Adicionar'}
                    </button>
                    {editingUserId && (
                      <button type="button" onClick={() => { setEditingUserId(null); setUserForm({ nome: '', email: '', role: 'usuario', ativo: true }); setUserErrors({}) }} className={btnSecondary}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {configuracoesModalTab === 'perfil' && (
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  value={profile.nome}
                  onChange={(e) => setProfile((p) => ({ ...p, nome: e.target.value }))}
                  className={inputBase}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className={inputBase}
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  value={profile.telefone}
                  onChange={(e) => setProfile((p) => ({ ...p, telefone: e.target.value }))}
                  className={inputBase}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input
                  value={profile.cargo}
                  onChange={(e) => setProfile((p) => ({ ...p, cargo: e.target.value }))}
                  className={inputBase}
                  placeholder="Ex: Cliente"
                />
              </div>
              <button type="button" onClick={handleSaveProfile} className={btnPrimary}>Salvar perfil</button>
            </div>
          )}

          {configuracoesModalTab === 'preferencias' && (
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                <select
                  value={preferences.tema}
                  onChange={(e) => setPreferences((p) => ({ ...p, tema: e.target.value as 'claro' | 'escuro' | 'sistema' }))}
                  className={inputBase}
                >
                  <option value="claro">Claro</option>
                  <option value="escuro">Escuro</option>
                  <option value="sistema">Sistema</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                <select
                  value={preferences.idioma}
                  onChange={(e) => setPreferences((p) => ({ ...p, idioma: e.target.value }))}
                  className={inputBase}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notificacoesEmail}
                  onChange={(e) => setPreferences((p) => ({ ...p, notificacoesEmail: e.target.checked }))}
                  className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-gray-700">Notificações por e-mail</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notificacoesPush}
                  onChange={(e) => setPreferences((p) => ({ ...p, notificacoesPush: e.target.checked }))}
                  className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-gray-700">Notificações push</span>
              </label>
              <button type="button" onClick={handleSavePreferences} className={btnPrimary}>Salvar preferências</button>
            </div>
          )}

          {configuracoesModalTab === 'seguranca' && (
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha atual</label>
                <input
                  type="password"
                  className={inputBase}
                  placeholder="••••••••"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                <input type="password" className={inputBase} placeholder="••••••••" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
                <input type="password" className={inputBase} placeholder="••••••••" readOnly />
              </div>
              <p className="text-sm text-gray-500">Alteração de senha disponível em versão futura.</p>
            </div>
          )}

          {configuracoesModalTab === 'permissoes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Permissões cadastradas</h3>
                <ul className="space-y-2">
                  {permissions.map((p) => (
                    <li
                      key={p.id}
                      className={cn(
                        'rounded-xl border px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer hover:bg-gray-50',
                        editingPermId === p.id ? 'border-[var(--primary)] bg-[var(--secondary)]/40' : 'border-gray-200'
                      )}
                      onClick={() => handleEditPermission(p)}
                    >
                      <div>
                        <div className="font-medium text-gray-900">{p.chave}</div>
                        <div className="text-xs text-gray-500">{p.descricao}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeletePermission(p.id) }}
                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">{editingPermId ? 'Editar permissão' : 'Nova permissão'}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chave</label>
                    <input
                      value={permForm.chave}
                      onChange={(e) => setPermForm((f) => ({ ...f, chave: e.target.value }))}
                      className={inputBase}
                      placeholder="ex: modulo.acao"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      value={permForm.descricao}
                      onChange={(e) => setPermForm((f) => ({ ...f, descricao: e.target.value }))}
                      className={inputBase}
                      placeholder="Descrição da permissão"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permForm.ativo}
                      onChange={(e) => setPermForm((f) => ({ ...f, ativo: e.target.checked }))}
                      className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm text-gray-700">Ativo</span>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={handleSavePermission} className={btnPrimary}>
                      {editingPermId ? 'Salvar' : 'Adicionar'}
                    </button>
                    {editingPermId && (
                      <button type="button" onClick={() => { setEditingPermId(null); setPermForm({ chave: '', descricao: '', ativo: true }) }} className={btnSecondary}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
