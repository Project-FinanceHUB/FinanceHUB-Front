'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as authAPI from '@/lib/api/auth'

type User = {
  id: string
  nome: string
  email: string
  role: string
}

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, code: string) => Promise<void>
  sendCode: (email: string) => Promise<void>
  logout: () => Promise<void>
  validateSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'financehub_auth_token'
const USER_KEY = 'financehub_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar sessão do localStorage ao iniciar
  useEffect(() => {
    const loadSession = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      try {
        const savedToken = localStorage.getItem(TOKEN_KEY)
        const savedUser = localStorage.getItem(USER_KEY)

        if (savedToken && savedUser) {
          // Validar token com o backend
          const validation = await authAPI.validateSession(savedToken)
          
          if (validation.valid && validation.session) {
            setToken(savedToken)
            setUser(validation.session.user)
            // Atualizar cookie também
            document.cookie = `auth_token=${savedToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
          } else {
            // Token inválido, limpar
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  const sendCode = async (email: string) => {
    await authAPI.sendAuthCode(email)
  }

  const login = async (email: string, code: string) => {
    try {
      console.log('[AuthContext] Iniciando login...')
      const response = await authAPI.verifyCode(email, code)
      
      console.log('[AuthContext] Resposta recebida:', { 
        success: response.success, 
        hasToken: !!response.token, 
        hasUser: !!response.user 
      })
      
      if (response.success && response.token && response.user) {
        setToken(response.token)
        setUser(response.user)
        
        // Salvar no localStorage e cookies
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, response.token)
          localStorage.setItem(USER_KEY, JSON.stringify(response.user))
          
          // Salvar também no cookie para o middleware funcionar
          document.cookie = `auth_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
          
          console.log('[AuthContext] Token e usuário salvos no localStorage e cookies')
        }
        
        console.log('[AuthContext] Login realizado com sucesso!')
      } else {
        console.error('[AuthContext] Resposta inválida:', response)
        throw new Error(response.error || 'Erro ao fazer login')
      }
    } catch (error: any) {
      console.error('[AuthContext] Erro no login:', error)
      throw error
    }
  }

  const logout = async () => {
    if (token) {
      try {
        await authAPI.logout(token)
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
    }

    setToken(null)
    setUser(null)

    // Limpar localStorage e cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      // Remover cookie
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  const validateSession = async (): Promise<boolean> => {
    if (!token) return false

    try {
      const validation = await authAPI.validateSession(token)
      
      if (validation.valid && validation.session) {
        setUser(validation.session.user)
        return true
      } else {
        await logout()
        return false
      }
    } catch (error) {
      await logout()
      return false
    }
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    sendCode,
    logout,
    validateSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
