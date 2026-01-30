'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Ticket, TicketFormData } from '@/types/ticket'
import type { Company } from '@/types/company'

const TICKETS_KEY = 'financehub_tickets'
const COMPANIES_KEY = 'financehub_companies'

const defaultCompanies: Company[] = [
  { id: 'c1', nome: 'Alvorada Soluções Tecnológicas Ltda', cnpjs: ['12.345.678/0001-90'], ativo: true },
  { id: 'c2', nome: 'Horizonte Verde Consultoria Ambiental Ltda', cnpjs: ['23.456.789/0001-01'], ativo: true },
  { id: 'c3', nome: 'Nova Era Comércio de Alimentos Ltda', cnpjs: ['34.567.890/0001-12'], ativo: true },
  { id: 'c4', nome: 'Atlas Engenharia e Projetos Ltda', cnpjs: ['45.678.901/0001-23'], ativo: true },
  { id: 'c5', nome: 'Vértice Logística Integrada Ltda', cnpjs: ['56.789.012/0001-34'], ativo: true },
  { id: 'c6', nome: 'Aurora Serviços Administrativos Ltda', cnpjs: ['67.890.123/0001-45'], ativo: true },
  { id: 'c7', nome: 'Pontal Distribuidora de Produtos Ltda', cnpjs: ['78.901.234/0001-56'], ativo: true },
]

function getInitialTickets(): Ticket[] {
  const now = new Date().toISOString()
  return [
    { id: '1', numero: '1', titulo: 'Alvorada Soluções Tecnológicas Ltda', origem: '12.345.678/0001-90', prioridade: 'media', status: 'aberto', estagio: 'Pendente', dataCriacao: now },
    { id: '2', numero: '2', titulo: 'Horizonte Verde Consultoria Ambiental Ltda', origem: '23.456.789/0001-01', prioridade: 'baixa', status: 'pendente', estagio: 'Pendente', dataCriacao: now },
    { id: '3', numero: '3', titulo: 'Nova Era Comércio de Alimentos Ltda', origem: '34.567.890/0001-12', prioridade: 'baixa', status: 'pendente', estagio: 'Pendente', dataCriacao: now },
    { id: '4', numero: '4', titulo: 'Atlas Engenharia e Projetos Ltda', origem: '45.678.901/0001-23', prioridade: 'alta', status: 'aberto', estagio: 'Em revisão', dataCriacao: now },
    { id: '5', numero: '5', titulo: 'Vértice Logística Integrada Ltda', origem: '56.789.012/0001-34', prioridade: 'media', status: 'aguardando_validacao', estagio: 'Aguardando validação', dataCriacao: now },
    { id: '6', numero: '6', titulo: 'Aurora Serviços Administrativos Ltda', origem: '67.890.123/0001-45', prioridade: 'media', status: 'aberto', estagio: 'Pendente', dataCriacao: now },
    { id: '7', numero: '7', titulo: 'Pontal Distribuidora de Produtos Ltda', origem: '78.901.234/0001-56', prioridade: 'baixa', status: 'fechado', estagio: 'Fechado', dataCriacao: now },
  ]
}

type DashboardContextValue = {
  companies: Company[]
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>
  tickets: Ticket[]
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>
  addTicket: (formData: TicketFormData) => void
  companiesModalOpen: boolean
  setCompaniesModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(() => {
    if (typeof window === 'undefined') return defaultCompanies
    try {
      const saved = localStorage.getItem(COMPANIES_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return defaultCompanies
  })

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    if (typeof window === 'undefined') return getInitialTickets()
    try {
      const saved = localStorage.getItem(TICKETS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return getInitialTickets()
  })

  const [companiesModalOpen, setCompaniesModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies))
    }
  }, [companies])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
    }
  }, [tickets])

  const addTicket = useCallback((formData: TicketFormData) => {
    const newTicket: Ticket = {
      ...formData,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    }
    setTickets((prev) => [newTicket, ...prev])
  }, [])

  const value: DashboardContextValue = {
    companies,
    setCompanies,
    tickets,
    setTickets,
    addTicket,
    companiesModalOpen,
    setCompaniesModalOpen,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
