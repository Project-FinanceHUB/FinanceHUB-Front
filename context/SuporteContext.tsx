'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Mensagem, MensagemFormData } from '@/types/suporte'

const MENSAGENS_KEY = 'financehub_suporte_mensagens'

const initialMensagens: Mensagem[] = [
  {
    id: '1',
    solicitacaoId: '1',
    direcao: 'recebida',
    assunto: 'Atualização da sua solicitação #1',
    conteudo: 'Olá! Sua solicitação foi atualizada e está em análise. Em breve retornaremos com mais informações sobre o processamento.',
    remetente: 'Suporte FinanceHub',
    dataHora: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    lida: false,
  },
  {
    id: '2',
    solicitacaoId: '4',
    direcao: 'enviada',
    assunto: 'Dúvida sobre boleto',
    conteudo: 'Preciso de esclarecimentos sobre o vencimento do boleto referente à empresa Atlas Engenharia.',
    remetente: 'Você',
    dataHora: new Date(Date.now() - 86400000).toISOString(),
    lida: true,
  },
  {
    id: '3',
    direcao: 'recebida',
    assunto: 'Bem-vindo ao Suporte',
    conteudo: 'Obrigado por entrar em contato. Nossa equipe está pronta para ajudá-lo. Responderemos em até 24h úteis.',
    remetente: 'Suporte FinanceHub',
    dataHora: new Date(Date.now() - 86400000 * 5).toISOString(),
    lida: true,
  },
]

type SuporteContextValue = {
  mensagens: Mensagem[]
  addMensagem: (data: MensagemFormData) => void
  marcarComoLida: (id: string) => void
  marcarTodasComoLidas: () => void
  suporteModalOpen: boolean
  setSuporteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  suporteModalTab: string
  setSuporteModalTab: React.Dispatch<React.SetStateAction<string>>
}

const SuporteContext = createContext<SuporteContextValue | null>(null)

export function SuporteProvider({ children }: { children: ReactNode }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(() => {
    if (typeof window === 'undefined') return initialMensagens
    try {
      const saved = localStorage.getItem(MENSAGENS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return initialMensagens
  })
  const [suporteModalOpen, setSuporteModalOpen] = useState(false)
  const [suporteModalTab, setSuporteModalTab] = useState('enviar')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MENSAGENS_KEY, JSON.stringify(mensagens))
    }
  }, [mensagens])

  const addMensagem = useCallback((data: MensagemFormData) => {
    const now = new Date().toISOString()
    const nova: Mensagem = {
      ...data,
      id: Date.now().toString(),
      dataHora: now,
      lida: false,
    }
    setMensagens((prev) => [nova, ...prev])
  }, [])

  const marcarComoLida = useCallback((id: string) => {
    setMensagens((prev) =>
      prev.map((m) => (m.id === id ? { ...m, lida: true } : m))
    )
  }, [])

  const marcarTodasComoLidas = useCallback(() => {
    setMensagens((prev) => prev.map((m) => ({ ...m, lida: true })))
  }, [])

  const value: SuporteContextValue = {
    mensagens,
    addMensagem,
    marcarComoLida,
    marcarTodasComoLidas,
    suporteModalOpen,
    setSuporteModalOpen,
    suporteModalTab,
    setSuporteModalTab,
  }

  return (
    <SuporteContext.Provider value={value}>{children}</SuporteContext.Provider>
  )
}

export function useSuporte() {
  const ctx = useContext(SuporteContext)
  if (!ctx) throw new Error('useSuporte must be used within SuporteProvider')
  return ctx
}
