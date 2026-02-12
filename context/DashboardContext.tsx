'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao'
import type { Company } from '@/types/company'
import * as companyAPI from '@/lib/api/companies'

const SOLICITACOES_KEY = 'financehub_solicitacoes'
const COMPANIES_KEY = 'financehub_companies'

/**
 * Gera um número de solicitação no formato FIN + 6 números aleatórios
 * Exemplo: FIN123456
 */
function generateSolicitacaoNumero(): string {
  const randomNumbers = Math.floor(100000 + Math.random() * 900000) // Gera número entre 100000 e 999999
  return `FIN${randomNumbers}`
}

const defaultCompanies: Company[] = [
  
]

function getInitialSolicitacoes(): Solicitacao[] {
  const now = new Date().toISOString()
  return [
    { id: '1', numero: 'FIN123456', titulo: 'Alvorada Soluções Tecnológicas Ltda', origem: '12.345.678/0001-90', prioridade: 'media', status: 'aberto', estagio: 'Pendente', dataCriacao: now },
    { id: '2', numero: 'FIN234567', titulo: 'Horizonte Verde Consultoria Ambiental Ltda', origem: '23.456.789/0001-01', prioridade: 'baixa', status: 'pendente', estagio: 'Pendente', dataCriacao: now },
    { id: '3', numero: 'FIN345678', titulo: 'Nova Era Comércio de Alimentos Ltda', origem: '34.567.890/0001-12', prioridade: 'baixa', status: 'pendente', estagio: 'Pendente', dataCriacao: now },
    { id: '4', numero: 'FIN456789', titulo: 'Atlas Engenharia e Projetos Ltda', origem: '45.678.901/0001-23', prioridade: 'alta', status: 'aberto', estagio: 'Em revisão', dataCriacao: now },
    { id: '5', numero: 'FIN567890', titulo: 'Vértice Logística Integrada Ltda', origem: '56.789.012/0001-34', prioridade: 'media', status: 'aguardando_validacao', estagio: 'Aguardando validação', dataCriacao: now },
    { id: '6', numero: 'FIN678901', titulo: 'Aurora Serviços Administrativos Ltda', origem: '67.890.123/0001-45', prioridade: 'media', status: 'aberto', estagio: 'Pendente', dataCriacao: now },
    { id: '7', numero: 'FIN789012', titulo: 'Pontal Distribuidora de Produtos Ltda', origem: '78.901.234/0001-56', prioridade: 'baixa', status: 'fechado', estagio: 'Fechado', dataCriacao: now },
  ]
}

type DashboardContextValue = {
  companies: Company[]
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>
  solicitacoes: Solicitacao[]
  setSolicitacoes: React.Dispatch<React.SetStateAction<Solicitacao[]>>
  addSolicitacao: (formData: SolicitacaoFormData) => void
  companiesModalOpen: boolean
  setCompaniesModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  error: string | null
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Migra IDs antigos (números simples) para o formato FIN + 6 números
   */
  const migrateSolicitacoesIds = useCallback((solicitacoes: Solicitacao[]): Solicitacao[] => {
    return solicitacoes.map((sol) => {
      // Se o número não começa com FIN, migra para o novo formato
      if (!sol.numero.startsWith('FIN')) {
        // Se for um número simples (1-9), gera um novo ID FIN
        if (/^\d+$/.test(sol.numero)) {
          return {
            ...sol,
            numero: generateSolicitacaoNumero(),
          }
        }
      }
      return sol
    })
  }, [])

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(() => {
    if (typeof window === 'undefined') return getInitialSolicitacoes()
    try {
      const saved = localStorage.getItem(SOLICITACOES_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Migra IDs antigos para o novo formato
        return migrateSolicitacoesIds(parsed)
      }
    } catch {}
    return getInitialSolicitacoes()
  })

  const [companiesModalOpen, setCompaniesModalOpen] = useState(false)

  // Carregar empresas da API
  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await companyAPI.getCompanies()
        setCompanies(data.length > 0 ? data : defaultCompanies)
        // Sincronizar com localStorage como backup
        if (typeof window !== 'undefined') {
          localStorage.setItem(COMPANIES_KEY, JSON.stringify(data.length > 0 ? data : defaultCompanies))
        }
      } catch (err: any) {
        console.error('Erro ao carregar empresas da API:', err)
        // Fallback para localStorage se API falhar
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem(COMPANIES_KEY)
            if (saved) {
              setCompanies(JSON.parse(saved))
            } else {
              setCompanies(defaultCompanies)
            }
          } catch {
            setCompanies(defaultCompanies)
          }
        } else {
          setCompanies(defaultCompanies)
        }
        setError('Erro ao carregar empresas. Usando dados locais.')
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      loadCompanies()
    } else {
      setCompanies(defaultCompanies)
      setLoading(false)
    }
  }, [])

  // Migrar IDs antigos na primeira carga
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSolicitacoes((prev) => {
        const needsMigration = prev.some((sol) => !sol.numero.startsWith('FIN'))
        if (needsMigration) {
          const migrated = migrateSolicitacoesIds(prev)
          localStorage.setItem(SOLICITACOES_KEY, JSON.stringify(migrated))
          return migrated
        }
        return prev
      })
    }
  }, [migrateSolicitacoesIds]) // Executa quando migrateSolicitacoesIds estiver disponível

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SOLICITACOES_KEY, JSON.stringify(solicitacoes))
    }
  }, [solicitacoes])

  // Sincronizar empresas com localStorage quando mudarem
  useEffect(() => {
    if (typeof window !== 'undefined' && companies.length > 0) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies))
    }
  }, [companies])

  const addSolicitacao = useCallback((formData: SolicitacaoFormData) => {
    const nova: Solicitacao = {
      ...formData,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    }
    setSolicitacoes((prev) => [nova, ...prev])
  }, [])

  const value: DashboardContextValue = {
    companies,
    setCompanies,
    solicitacoes,
    setSolicitacoes,
    addSolicitacao,
    companiesModalOpen,
    setCompaniesModalOpen,
    loading,
    error,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
