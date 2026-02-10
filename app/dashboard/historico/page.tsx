'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHistorico } from '@/context/HistoricoContext'
import type { HistoricoRegistro, HistoricoFormData, HistoricoTipo, HistoricoStatus } from '@/types/historico'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

const TIPOS: { value: HistoricoTipo; label: string }[] = [
  { value: 'boleto', label: 'Boleto' },
  { value: 'nota_fiscal', label: 'Nota Fiscal' },
  { value: 'acao_sistema', label: 'Ação do Sistema' },
]

const STATUS_OPTS: { value: HistoricoStatus; label: string }[] = [
  { value: 'enviado', label: 'Enviado' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'processado', label: 'Processado' },
  { value: 'erro', label: 'Erro' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
]

function formatarData(d: string) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function BadgeStatus({ status }: { status: HistoricoStatus }) {
  const tones: Record<string, string> = {
    enviado: 'bg-sky-50 text-sky-700 ring-sky-200',
    pendente: 'bg-amber-50 text-amber-800 ring-amber-200',
    processado: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    erro: 'bg-rose-50 text-rose-700 ring-rose-200',
    concluido: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    cancelado: 'bg-gray-100 text-gray-700 ring-gray-200',
  }
  const opt = STATUS_OPTS.find((s) => s.value === status)
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', tones[status] ?? 'bg-gray-100 text-gray-700')}>
      {opt?.label ?? status}
    </span>
  )
}

function BadgeTipo({ tipo }: { tipo: HistoricoTipo }) {
  const tones: Record<string, string> = {
    boleto: 'bg-amber-50 text-amber-800',
    nota_fiscal: 'bg-blue-50 text-blue-700',
    acao_sistema: 'bg-gray-100 text-gray-700',
  }
  const opt = TIPOS.find((t) => t.value === tipo)
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', tones[tipo] ?? 'bg-gray-100')}>
      {opt?.label ?? tipo}
    </span>
  )
}

const defaultForm: HistoricoFormData = {
  tipo: 'boleto',
  categoria: 'Boleto',
  protocolo: '',
  data: new Date().toISOString().slice(0, 10),
  horario: new Date().toTimeString().slice(0, 5),
  status: 'pendente',
  titulo: '',
  descricao: '',
  origem: '',
  cnpj: '',
  valor: '',
  observacoes: '',
}

export default function HistoricoPage() {
  const router = useRouter()
  const {
    registros,
    deleteRegistro,
    syncFromLancamentos,
  } = useHistorico()

  const [mounted, setMounted] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<HistoricoTipo | 'todos'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<HistoricoStatus | 'todos'>('todos')
  const [filtroBusca, setFiltroBusca] = useState('')
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false)
  const [registroParaDetalhes, setRegistroParaDetalhes] = useState<HistoricoRegistro | null>(null)

  useEffect(() => {
    setMounted(true)
    syncFromLancamentos()
  }, [syncFromLancamentos])

  useEffect(() => {
    if (modalDetalhesOpen) {
      document.body.style.overflow = 'hidden'
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseModal()
        }
      }
      window.addEventListener('keydown', handleEscape)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [modalDetalhesOpen])

  const filtered = registros.filter((r) => {
    if (filtroTipo !== 'todos' && r.tipo !== filtroTipo) return false
    if (filtroStatus !== 'todos' && r.status !== filtroStatus) return false
    if (filtroBusca.trim()) {
      const q = filtroBusca.toLowerCase()
      return (
        r.protocolo.toLowerCase().includes(q) ||
        r.titulo.toLowerCase().includes(q) ||
        (r.descricao ?? '').toLowerCase().includes(q) ||
        (r.origem ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })


  const handleEdit = (r: HistoricoRegistro) => {
    router.push(`/dashboard/historico/editar/${r.id}`)
  }

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Excluir este registro do histórico?')) return
    deleteRegistro(id)
    if (registroParaDetalhes?.id === id) {
      handleCloseModal()
    }
  }

  const handleVerDetalhes = (r: HistoricoRegistro) => {
    setRegistroParaDetalhes(r)
    setModalDetalhesOpen(true)
  }

  const handleCloseModal = () => {
    setModalDetalhesOpen(false)
    setRegistroParaDetalhes(null)
  }

  const handleNewRegistro = () => {
    router.push('/dashboard/historico/novo')
  }

  const inputBase = 'w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-white border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40'
  const inputError = 'border-red-300'
  const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition'
  const btnSecondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition'

  return (
    <div className="px-4 sm:px-6 py-6 w-full max-w-full">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Histórico</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Boletos e notas fiscais já enviados: protocolos, datas, status e registro completo de ações.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          
          <button
            type="button"
            onClick={handleNewRegistro}
            className={btnPrimary}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo registro
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="mb-6 rounded-2xl bg-white border border-gray-200 p-5 shadow-sm w-full">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de Busca */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por protocolo, título, descrição..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              className={cn(inputBase, 'pl-11 pr-4 py-2.5')}
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
            {/* Filtro Tipo */}
            <div className="relative flex-1 sm:flex-none sm:min-w-[180px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as HistoricoTipo | 'todos')}
                className={cn(inputBase, 'pl-11 pr-10 py-2.5 text-sm appearance-none cursor-pointer bg-white')}
              >
                <option value="todos">Todos os tipos</option>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Filtro Status */}
            <div className="relative flex-1 sm:flex-none sm:min-w-[180px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as HistoricoStatus | 'todos')}
                className={cn(inputBase, 'pl-11 pr-10 py-2.5 text-sm appearance-none cursor-pointer bg-white')}
              >
                <option value="todos">Todos os status</option>
                {STATUS_OPTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Botão Limpar Filtros */}
            {(filtroTipo !== 'todos' || filtroStatus !== 'todos' || filtroBusca.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setFiltroTipo('todos')
                  setFiltroStatus('todos')
                  setFiltroBusca('')
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Indicador de filtros ativos */}
        {(filtroTipo !== 'todos' || filtroStatus !== 'todos' || filtroBusca.trim()) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="font-medium">Filtros ativos:</span>
              {filtroBusca.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Busca: "{filtroBusca}"
                  <button
                    type="button"
                    onClick={() => setFiltroBusca('')}
                    className="hover:text-blue-900"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filtroTipo !== 'todos' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Tipo: {TIPOS.find(t => t.value === filtroTipo)?.label}
                  <button
                    type="button"
                    onClick={() => setFiltroTipo('todos')}
                    className="hover:text-amber-900"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filtroStatus !== 'todos' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Status: {STATUS_OPTS.find(s => s.value === filtroStatus)?.label}
                  <button
                    type="button"
                    onClick={() => setFiltroStatus('todos')}
                    className="hover:text-emerald-900"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Layout principal: Lista */}
      <div className="w-full max-w-full">
        {/* Lista de Registros */}
        <div className="w-full max-w-full">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Registros {mounted ? `(${filtered.length})` : ''}
            </h2>
          </div>
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto w-full max-w-full">
              {!mounted ? (
                <div className="p-8 text-center">
                  <div className="text-sm text-gray-500">Carregando...</div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Nenhum registro encontrado.</p>
                  <button
                    type="button"
                    onClick={handleNewRegistro}
                    className={cn(btnPrimary, 'mt-4')}
                  >
                    + Criar primeiro registro
                  </button>
                </div>
              ) : (
                <>
                  {/* Cards para Mobile e Tablet */}
                  <div className="lg:hidden space-y-4 w-full p-4">
                    {filtered.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow w-full"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate">{r.titulo}</div>
                            <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                              <BadgeTipo tipo={r.tipo} />
                              <BadgeStatus status={r.status} />
                              <span className="text-xs text-gray-500 font-mono">{r.protocolo}</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {formatarData(r.data)} às {r.horario}
                            </div>
                            {r.descricao && (
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{r.descricao}</p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleVerDetalhes(r) }}
                              className="w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition"
                              title="Ver detalhes"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleEdit(r) }}
                              className="w-8 h-8 rounded-lg text-gray-400 hover:text-[var(--primary)] hover:bg-[rgba(3,154,66,0.08)] flex items-center justify-center transition"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }}
                              className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                              title="Excluir"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tabela para Desktop (acima de 1024px) */}
                  <div className="hidden lg:block overflow-x-auto w-full max-w-full">
                    <table className="w-full max-w-full" style={{ width: '100%', maxWidth: '100%' }}>
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Título
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Tipo / Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Protocolo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Data / Horário
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Descrição
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filtered.map((r) => (
                          <tr
                            key={r.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3">
                              <div className="text-sm font-semibold text-gray-900">{r.titulo}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <BadgeTipo tipo={r.tipo} />
                                <BadgeStatus status={r.status} />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-gray-500 font-mono">{r.protocolo}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900">
                                {formatarData(r.data)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {r.horario}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-600 max-w-xs truncate" title={r.descricao || undefined}>
                                {r.descricao || '—'}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleVerDetalhes(r) }}
                                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition"
                                  title="Ver detalhes"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleEdit(r) }}
                                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-[var(--primary)] hover:bg-[rgba(3,154,66,0.08)] flex items-center justify-center transition"
                                  title="Editar"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }}
                                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                                  title="Excluir"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {modalDetalhesOpen && registroParaDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true" />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detalhes do registro</h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                aria-label="Fechar"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-500 font-medium mb-1">Protocolo</dt>
                  <dd className="font-mono text-gray-900">{registroParaDetalhes.protocolo}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium mb-1">Tipo / Status</dt>
                  <dd className="flex gap-2">
                    <BadgeTipo tipo={registroParaDetalhes.tipo} />
                    <BadgeStatus status={registroParaDetalhes.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium mb-1">Data e horário</dt>
                  <dd className="text-gray-900">{formatarData(registroParaDetalhes.data)} às {registroParaDetalhes.horario}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 font-medium mb-1">Título</dt>
                  <dd className="text-gray-900">{registroParaDetalhes.titulo}</dd>
                </div>
                {registroParaDetalhes.descricao && (
                  <div>
                    <dt className="text-gray-500 font-medium mb-1">Descrição</dt>
                    <dd className="text-gray-900">{registroParaDetalhes.descricao}</dd>
                  </div>
                )}
                {registroParaDetalhes.origem && (
                  <div>
                    <dt className="text-gray-500 font-medium mb-1">Origem / CNPJ</dt>
                    <dd className="text-gray-900 font-mono">{registroParaDetalhes.origem}</dd>
                  </div>
                )}
                {registroParaDetalhes.valor && (
                  <div>
                    <dt className="text-gray-500 font-medium mb-1">Valor</dt>
                    <dd className="text-gray-900 font-semibold text-lg">{registroParaDetalhes.valor}</dd>
                  </div>
                )}
                {registroParaDetalhes.observacoes && (
                  <div>
                    <dt className="text-gray-500 font-medium mb-1">Observações</dt>
                    <dd className="text-gray-900">{registroParaDetalhes.observacoes}</dd>
                  </div>
                )}
                {registroParaDetalhes.dataAtualizacao && (
                  <div>
                    <dt className="text-gray-500 font-medium mb-1">Última atualização</dt>
                    <dd className="text-gray-900 text-xs">{new Date(registroParaDetalhes.dataAtualizacao).toLocaleString('pt-BR')}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  handleCloseModal()
                  handleEdit(registroParaDetalhes)
                }}
                className={btnPrimary}
              >
                Editar registro
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className={btnSecondary}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
