'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type {
  User,
  UserFormData,
  Profile,
  Preferences,
  Permission,
  PermissionFormData,
} from '@/types/configuracoes'
import * as userAPI from '@/lib/api/users'

const USERS_KEY = 'financehub_users'
const PROFILE_KEY = 'financehub_profile'
const PREFERENCES_KEY = 'financehub_preferences'
const PERMISSIONS_KEY = 'financehub_permissions'

const defaultProfile: Profile = {
  nome: 'Brendow Lucas',
  email: 'brendow@empresa.com',
  telefone: '(11) 99999-9999',
  cargo: 'Cliente',
}

const defaultPreferences: Preferences = {
  tema: 'claro',
  idioma: 'pt-BR',
  notificacoesEmail: true,
  notificacoesPush: false,
}

const defaultPermissions: Permission[] = [
  { id: 'p1', chave: 'dashboard.visualizar', descricao: 'Visualizar dashboard', ativo: true },
  { id: 'p2', chave: 'lancamentos.gerenciar', descricao: 'Gerenciar lançamentos', ativo: true },
  { id: 'p3', chave: 'empresas.gerenciar', descricao: 'Gerenciar empresas', ativo: true },
  { id: 'p4', chave: 'configuracoes.gerenciar', descricao: 'Gerenciar configurações', ativo: true },
]

type ConfiguracoesContextValue = {
  users: User[]
  addUser: (data: UserFormData) => Promise<void>
  updateUser: (id: string, data: Partial<UserFormData>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
  preferences: Preferences
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>
  permissions: Permission[]
  addPermission: (data: PermissionFormData) => void
  updatePermission: (id: string, data: Partial<PermissionFormData>) => void
  deletePermission: (id: string) => void
  configuracoesModalOpen: boolean
  setConfiguracoesModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  configuracoesModalTab: string
  setConfiguracoesModalTab: React.Dispatch<React.SetStateAction<string>>
  loading: boolean
  error: string | null
}

const ConfiguracoesContext = createContext<ConfiguracoesContextValue | null>(null)

export function ConfiguracoesProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [profile, setProfile] = useState<Profile>(() => {
    if (typeof window === 'undefined') return defaultProfile
    try {
      const saved = localStorage.getItem(PROFILE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return defaultProfile
  })

  const [preferences, setPreferences] = useState<Preferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return defaultPreferences
  })

  const [permissions, setPermissions] = useState<Permission[]>(() => {
    if (typeof window === 'undefined') return defaultPermissions
    try {
      const saved = localStorage.getItem(PERMISSIONS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return defaultPermissions
  })

  const [configuracoesModalOpen, setConfiguracoesModalOpen] = useState(false)
  const [configuracoesModalTab, setConfiguracoesModalTab] = useState('usuarios')

  // Carregar usuários da API
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await userAPI.getUsers()
        setUsers(data)
        // Sincronizar com localStorage como backup
        if (typeof window !== 'undefined') {
          localStorage.setItem(USERS_KEY, JSON.stringify(data))
        }
      } catch (err: any) {
        console.error('Erro ao carregar usuários da API:', err)
        // Fallback para localStorage se API falhar
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem(USERS_KEY)
            if (saved) {
              setUsers(JSON.parse(saved))
            }
          } catch {}
        }
        setError('Erro ao carregar usuários. Usando dados locais.')
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      loadUsers()
    }
  }, [])

  // Salvar profile no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    }
  }, [profile])

  // Salvar preferences no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
    }
  }, [preferences])

  // Salvar permissions no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions))
    }
  }, [permissions])

  const addUser = useCallback(async (data: UserFormData) => {
    try {
      const newUser = await userAPI.createUser(data)
      setUsers((prev) => [...prev, newUser])
      // Atualizar localStorage
      if (typeof window !== 'undefined') {
        const updated = [...users, newUser]
        localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      }
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err)
      // Fallback para localStorage
      const newUser: User = {
        ...data,
        id: Date.now().toString(),
      }
      setUsers((prev) => [...prev, newUser])
      if (typeof window !== 'undefined') {
        const updated = [...users, newUser]
        localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      }
      throw err
    }
  }, [users])

  const updateUser = useCallback(async (id: string, data: Partial<UserFormData>) => {
    try {
      const updatedUser = await userAPI.updateUser(id, data)
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)))
      // Atualizar localStorage
      if (typeof window !== 'undefined') {
        const updated = users.map((u) => (u.id === id ? updatedUser : u))
        localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      }
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err)
      // Fallback para localStorage
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
      if (typeof window !== 'undefined') {
        const updated = users.map((u) => (u.id === id ? { ...u, ...data } : u))
        localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      }
      throw err
    }
  }, [users])

  const deleteUser = useCallback(async (id: string) => {
    try {
      await userAPI.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      // Atualizar localStorage
      if (typeof window !== 'undefined') {
        const updated = users.filter((u) => u.id !== id)
        localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      }
    } catch (err: any) {
      console.error('Erro ao deletar usuário:', err)
      // Fallback para localStorage
      setUsers((prev) => prev.filter((u) => u.id !== id))
      if (typeof window !== 'undefined') {
        const updated = users.filter((u) => u.id !== id)
        localStorage.setItem(USERS_KEY, JSON.stringify(updated))
      }
      throw err
    }
  }, [users])

  const addPermission = (data: PermissionFormData) => {
    const newPerm: Permission = {
      ...data,
      id: Date.now().toString(),
    }
    setPermissions((prev) => [...prev, newPerm])
  }

  const updatePermission = (id: string, data: Partial<PermissionFormData>) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    )
  }

  const deletePermission = (id: string) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id))
  }

  const value: ConfiguracoesContextValue = {
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
    loading,
    error,
  }

  return (
    <ConfiguracoesContext.Provider value={value}>
      {children}
    </ConfiguracoesContext.Provider>
  )
}

export function useConfiguracoes() {
  const ctx = useContext(ConfiguracoesContext)
  if (!ctx) throw new Error('useConfiguracoes must be used within ConfiguracoesProvider')
  return ctx
}
