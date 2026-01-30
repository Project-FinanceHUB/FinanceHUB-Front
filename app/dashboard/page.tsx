'use client'

import { useMemo, useState, useEffect } from 'react'
import ResponsiveTable from '@/components/ResponsiveTable'
import SolicitacaoModal from '@/components/SolicitacaoModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import BoletoPaymentsChart from '@/components/BoletoPaymentsChart'
import { useDashboard } from '@/context/DashboardContext'
import type { Solicitacao, SolicitacaoFormData, SolicitacaoStatus } from '@/types/solicitacao'
import type { Company, CompanyFormData } from '@/types/company'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'gray' | 'green' | 'amber' | 'blue' | 'red' }) {
  const tones: Record<typeof tone, string> = {
    gray: 'bg-gray-100 text-gray-700 ring-gray-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-800 ring-amber-200',
    blue: 'bg-sky-50 text-sky-700 ring-sky-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200',
  }

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', tones[tone])}>
      {children}
    </span>
  )
}

function Icon({ name, className }: { name: string; className?: string }) {
  const cls = cn('w-5 h-5', className)
  switch (name) {
    case 'dashboard':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z" fill="currentColor" />
        </svg>
      )
    case 'solicitacao':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V7Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'invoice':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 3h10l2 2v16l-2-1-2 1-2-1-2 1-2-1-2 1-2-1V5l2-2Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 8h6M9 12h6M9 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'bill':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1-2-1V3Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.5 8h7M8.5 11h7M8.5 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 18h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'inbox':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4h16v12h-4l-2 3h-4l-2-3H4V4Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 9h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'bell':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'settings':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M19.4 15a7.97 7.97 0 0 0 .1-1 7.97 7.97 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a8 8 0 0 0-1.7-1l-.4-2.6H10l-.4 2.6a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L5.6 13a7.97 7.97 0 0 0-.1 1c0 .34.03.67.1 1L3.6 16.6l2 3.4 2.4-1a8 8 0 0 0 1.7 1l.4 2.6h4.2l.4-2.6a8 8 0 0 0 1.7-1l2.4 1 2-3.4L19.4 15Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      )
    case 'search':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
      case 'plus':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
      case 'menu':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
      case 'edit':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
      case 'trash':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'lancamentos':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'historico':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'suporte':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
      default:
      return <span className={cls} aria-hidden="true" />
    }
  }

export default function DashboardPage() {
  const { companies, setCompanies, solicitacoes, setSolicitacoes, addSolicitacao, setCompaniesModalOpen } = useDashboard()
  const [mounted, setMounted] = useState(false)
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'pendente' | 'em_revisao' | 'fechado'>('todos')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'numero' | 'titulo' | 'origem' | 'status'>('numero')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [pageSize, setPageSize] = useState<10 | 20 | 30 | 50>(10)
  const [isSolicitacaoModalOpen, setIsSolicitacaoModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | undefined>()
  const [solicitacaoToDelete, setSolicitacaoToDelete] = useState<Solicitacao | undefined>()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Atualiza companies quando a página volta ao foco (após voltar da página de empresas)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleFocus = () => {
        const saved = localStorage.getItem('financehub_companies')
        if (saved) {
          try {
            setCompanies(JSON.parse(saved))
          } catch {
            // Ignora erros de parsing
          }
        }
      }
      window.addEventListener('focus', handleFocus)
      return () => window.removeEventListener('focus', handleFocus)
    }
  }, [setCompanies])

  const handleCreateSolicitacao = addSolicitacao

  const handleUpdateSolicitacao = (formData: SolicitacaoFormData) => {
    if (!selectedSolicitacao) return
    setSolicitacoes((prev) =>
      prev.map((sol) =>
        sol.id === selectedSolicitacao.id
          ? { ...sol, ...formData, dataAtualizacao: new Date().toISOString() }
          : sol
      )
    )
    setSelectedSolicitacao(undefined)
  }

  const handleDeleteSolicitacao = () => {
    if (!solicitacaoToDelete) return
    setSolicitacoes((prev) => prev.filter((sol) => sol.id !== solicitacaoToDelete.id))
    setSolicitacaoToDelete(undefined)
  }

  const openCreateModal = () => {
    setSelectedSolicitacao(undefined)
    setIsSolicitacaoModalOpen(true)
  }

  const openEditModal = (solicitacao: Solicitacao) => {
    setSelectedSolicitacao(solicitacao)
    setIsSolicitacaoModalOpen(true)
  }

  const openDeleteModal = (solicitacao: Solicitacao) => {
    setSolicitacaoToDelete(solicitacao)
    setIsDeleteModalOpen(true)
  }

  const handleSolicitacaoSubmit = (formData: SolicitacaoFormData) => {
    if (selectedSolicitacao) {
      handleUpdateSolicitacao(formData)
    } else {
      handleCreateSolicitacao(formData)
    }
  }


  const solicitacoesFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = solicitacoes.filter((t) => {
      const statusLabel = t.status === 'aberto'
        ? 'aberto'
        : t.status === 'pendente'
        ? 'pendente'
        : t.status === 'aguardando_validacao'
        ? 'aguardando validacao'
        : 'fechado'

      const matchQuery =
        !q ||
        t.numero.toLowerCase().includes(q) ||
        t.titulo.toLowerCase().includes(q) ||
        t.origem.toLowerCase().includes(q) ||
        statusLabel.includes(q)

      const matchStatus =
        statusFiltro === 'todos' ||
        (statusFiltro === 'pendente' && (t.status === 'pendente' || t.status === 'aguardando_validacao')) ||
        (statusFiltro === 'em_revisao' && t.estagio === 'Em revisão') ||
        (statusFiltro === 'fechado' && t.status === 'fechado')

      return matchQuery && matchStatus
    })

    const sorted = [...filtered].sort((a, b) => {
      const getValue = (sol: Solicitacao) => {
        switch (sortBy) {
          case 'numero':
            return sol.numero
          case 'titulo':
            return sol.titulo
          case 'origem':
            return sol.origem
          case 'status':
            return sol.status
          default:
            return ''
        }
      }

      const aVal = getValue(a).toString().toLowerCase()
      const bVal = getValue(b).toString().toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [solicitacoes, query, statusFiltro, sortBy, sortDirection])

  const solicitacoesVisiveis = useMemo(
    () => solicitacoesFiltradas.slice(0, pageSize),
    [solicitacoesFiltradas, pageSize]
  )

  const totals = useMemo(() => {
    const boletosEmAberto = 3
    const solicitacoesPendentes = solicitacoes.filter((t) => t.status === 'pendente' || t.status === 'aguardando_validacao').length
    const mensagensNaoLidas = 2
    return { boletosEmAberto, solicitacoesPendentes, mensagensNaoLidas }
  }, [solicitacoes])

  if (!mounted) {
    return (
      <div className="px-4 sm:px-6 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 text-sm">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <>
      <div className="px-4 sm:px-6 py-6">
            {/* Headline + Quick actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Solicitações</h1>
                <p className="text-sm text-gray-500">Visão centralizada de suporte, comunicação e pendências financeiras.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-[var(--accent)] transition"
                >
                  <Icon name="plus" className="w-5 h-5" />
                  Abrir solicitação
                </button>
                <button
                  type="button"
                  onClick={() => setCompaniesModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  <Icon name="settings" className="w-5 h-5" />
                  Gerenciar empresas
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Boletos em aberto</div>
                    <div className="text-3xl font-semibold mt-1">{totals.boletosEmAberto}</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-100">
                    <Icon name="bill" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">Acompanhe status e baixe PDFs rapidamente.</div>
              </div>
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Solicitações pendentes</div>
                    <div className="text-3xl font-semibold mt-1">{totals.solicitacoesPendentes}</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center ring-1 ring-amber-100">
                    <Icon name="solicitacao" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">Priorize o que precisa de validação.</div>
              </div>
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Mensagens não lidas</div>
                    <div className="text-3xl font-semibold mt-1">{totals.mensagensNaoLidas}</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center ring-1 ring-sky-100">
                    <Icon name="inbox" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">Respostas do suporte e avisos do sistema.</div>
              </div>
            </div>

            {/* Gráfico de pagamentos de boletos */}
            <div className="mt-6">
              <BoletoPaymentsChart />
            </div>

            {/* Tabela de solicitações */}
            <div className="mt-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="p-4 sm:p-5 space-y-3">
                {/* Busca + tamanho da página */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon name="search" className="w-4 h-4" />
                    </span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Pesquisar por ID, razão social ou CNPJ..."
                      className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal/40"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">Exibir</span>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value) as 10 | 20 | 30 | 50)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal/40"
                    >
                      <option value={10}>10 itens</option>
                      <option value={20}>20 itens</option>
                      <option value={30}>30 itens</option>
                      <option value={50}>50 itens</option>
                    </select>
                  </div>
                </div>

                {/* Filtros de status */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusFiltro('todos')}
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm font-semibold border',
                      statusFiltro === 'todos'
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    Todos abertos
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFiltro('pendente')}
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm font-semibold border',
                      statusFiltro === 'pendente'
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    Solicitações pendentes
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFiltro('em_revisao')}
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm font-semibold border',
                      statusFiltro === 'em_revisao'
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    Em revisão
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFiltro('fechado')}
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm font-semibold border',
                      statusFiltro === 'fechado'
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    Fechados
                  </button>
                </div>
              </div>

              <ResponsiveTable
                aria-label="Tabela de solicitações"
                columns={[
                  { key: 'numero', label: 'Número/ID', cellClassName: 'font-semibold text-teal-dark' },
                  { key: 'titulo', label: 'Razão Social', cellClassName: 'text-gray-900' },
                  { key: 'origem', label: 'CNPJ', cellClassName: 'text-gray-600' },
                  { key: 'status' as any, label: 'Status' },
                  { key: 'acoes' as any, label: 'Ações' },
                ]}
                rows={solicitacoesVisiveis as any}
                renderCell={(row, key) => {
                  const t = row as Solicitacao
                  const columnKey = key as string

                  const statusTone: Record<SolicitacaoStatus, 'green' | 'amber' | 'blue' | 'gray'> = {
                    aberto: 'green',
                    pendente: 'amber',
                    aguardando_validacao: 'blue',
                    fechado: 'gray',
                  }
                  const statusLabel: Record<SolicitacaoStatus, string> = {
                    aberto: 'Aberto',
                    pendente: 'Pendente',
                    aguardando_validacao: 'Aguardando validação',
                    fechado: 'Fechado',
                  }

                  if (columnKey === 'status') {
                    return <Badge tone={statusTone[t.status]}>{statusLabel[t.status]}</Badge>
                  }

                  if (columnKey === 'acoes') {
                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(t)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-[var(--primary)] hover:bg-[rgba(3,154,66,0.08)] transition"
                          aria-label="Editar registro"
                          title="Editar registro"
                        >
                          <Icon name="edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(t)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                          aria-label="Excluir registro"
                          title="Excluir registro"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  }

                  return (t as any)[columnKey]
                }}
              />

              {solicitacoesVisiveis.length === 0 && (
                <div className="px-5 py-10 text-center text-gray-500 text-sm">
                  Nenhuma solicitação encontrada para o filtro/pesquisa atual.
                </div>
              )}
            </div>
          </div>

      {/* Modais */}
      <SolicitacaoModal
        isOpen={isSolicitacaoModalOpen}
        solicitacao={selectedSolicitacao}
        companies={companies}
        onClose={() => {
          setIsSolicitacaoModalOpen(false)
          setSelectedSolicitacao(undefined)
        }}
        onSubmit={handleSolicitacaoSubmit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        solicitacaoNumero={solicitacaoToDelete?.numero || ''}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSolicitacaoToDelete(undefined)
        }}
        onConfirm={handleDeleteSolicitacao}
      />
    </>
  )
}

