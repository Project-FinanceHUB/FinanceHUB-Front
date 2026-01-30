'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type {
  User,
  UserFormData,
  Profile,
  Preferences,
  Permission,
  PermissionFormData,
} from '@/types/configuracoes'

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
  addUser: (data: UserFormData) => void
  updateUser: (id: string, data: Partial<UserFormData>) => void
  deleteUser: (id: string) => void
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
}

const ConfiguracoesContext = createContext<ConfiguracoesContextValue | null>(null)

export function ConfiguracoesProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(USERS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
  }, [users])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    }
  }, [profile])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
    }
  }, [preferences])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions))
    }
  }, [permissions])

  const addUser = (data: UserFormData) => {
    const newUser: User = {
      ...data,
      id: Date.now().toString(),
    }
    setUsers((prev) => [...prev, newUser])
  }

  const updateUser = (id: string, data: Partial<UserFormData>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

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
