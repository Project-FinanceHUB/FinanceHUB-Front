'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from './Skeleton'
import type { Solicitacao } from '@/types/solicitacao'

export type BoletoStatus = 'pago' | 'pendente' | 'vencido'

type StatusFilter = Record<BoletoStatus, boolean>

export interface MonthBoletoData {
  mes: string
  pago: number
  pendente: number
  vencido: number
  qtdPago: number
  qtdPendente: number
  qtdVencido: number
}

const COLORS = {
  pago: '#10B981',     // verde esmeralda (sucesso)
  pendente: '#F59E0B', // âmbar/laranja (atenção)
  vencido: '#EF4444',  // vermelho (alerta)
}

// Dados mock para evolução ao longo de 12 meses
const MOCK_DATA: MonthBoletoData[] = [
  { mes: 'Mês 1',  pago: 4200,  pendente: 1800,  vencido: 0,    qtdPago: 4, qtdPendente: 2, qtdVencido: 0 },
  { mes: 'Mês 2',  pago: 5800,  pendente: 1200,  vencido: 500,  qtdPago: 5, qtdPendente: 1, qtdVencido: 1 },
  { mes: 'Mês 3',  pago: 7200,  pendente: 2400,  vencido: 0,    qtdPago: 6, qtdPendente: 2, qtdVencido: 0 },
  { mes: 'Mês 4',  pago: 6500,  pendente: 1500,  vencido: 800,  qtdPago: 5, qtdPendente: 1, qtdVencido: 1 },
  { mes: 'Mês 5',  pago: 8900,  pendente: 2100,  vencido: 0,    qtdPago: 7, qtdPendente: 2, qtdVencido: 0 },
  { mes: 'Mês 6',  pago: 7800,  pendente: 3200,  vencido: 400,  qtdPago: 6, qtdPendente: 3, qtdVencido: 1 },
  { mes: 'Mês 7',  pago: 9500,  pendente: 1800,  vencido: 0,    qtdPago: 8, qtdPendente: 1, qtdVencido: 0 },
  { mes: 'Mês 8',  pago: 10200, pendente: 2400,  vencido: 600,  qtdPago: 8, qtdPendente: 2, qtdVencido: 1 },
  { mes: 'Mês 9',  pago: 8800,  pendente: 1500,  vencido: 0,    qtdPago: 7, qtdPendente: 1, qtdVencido: 0 },
  { mes: 'Mês 10', pago: 11000, pendente: 2000,  vencido: 300,  qtdPago: 9, qtdPendente: 2, qtdVencido: 1 },
  { mes: 'Mês 11', pago: 9800,  pendente: 2800,  vencido: 0,    qtdPago: 8, qtdPendente: 2, qtdVencido: 0 },
  { mes: 'Mês 12', pago: 12500, pendente: 0,     vencido: 0,    qtdPago: 10, qtdPendente: 0, qtdVencido: 0 },
]

/** Valor exibido por boleto quando os dados vêm das solicitações (sem valor real) */
const VALOR_POR_BOLETO = 1000

/** Mapeia status da solicitação para status do boleto no gráfico */
function statusToBoletoStatus(status: Solicitacao['status']): BoletoStatus {
  if (status === 'concluido' || status === 'fechado' || status === 'aprovado') return 'pago'
  if (status === 'rejeitado' || status === 'cancelado') return 'vencido'
  return 'pendente'
}

/** Gera rótulos dos últimos 12 meses (Mês 1 = mais antigo, Mês 12 = mais recente) */
function getLast12MonthsLabels(): string[] {
  const labels: string[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(`Mês ${12 - i}`)
  }
  return labels
}

/** Constrói dados do gráfico a partir das solicitações que possuem boleto */
function buildChartDataFromSolicitacoes(solicitacoes: Solicitacao[]): MonthBoletoData[] {
  const labels = getLast12MonthsLabels()
  const now = new Date()
  const months: MonthBoletoData[] = labels.map((mes, idx) => ({
    mes,
    pago: 0,
    pendente: 0,
    vencido: 0,
    qtdPago: 0,
    qtdPendente: 0,
    qtdVencido: 0,
  }))

  const comBoleto = solicitacoes.filter((s) => s.boletoPath || (s.boleto && typeof s.boleto === 'string'))
  if (comBoleto.length === 0) return months

  // Mês 12 = atual, Mês 11 = um mês atrás, ...
  const getMonthIndex = (dateStr: string | undefined): number => {
    if (!dateStr) return 11
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return 11
    const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
    if (diffMonths < 0) return 11
    if (diffMonths > 11) return 0
    return 11 - diffMonths
  }

  for (const s of comBoleto) {
    // Usar o mês selecionado na solicitação (1-12) ou derivar da data de criação
    const mesNum = s.mes != null ? Number(s.mes) : NaN
    const idx =
      !Number.isNaN(mesNum) && mesNum >= 1 && mesNum <= 12
        ? mesNum - 1
        : getMonthIndex(s.dataCriacao)
    const row = months[idx]
    if (!row) continue
    const status = statusToBoletoStatus(s.status)
    if (status === 'pago') {
      row.qtdPago += 1
      row.pago += VALOR_POR_BOLETO
    } else if (status === 'pendente') {
      row.qtdPendente += 1
      row.pendente += VALOR_POR_BOLETO
    } else {
      row.qtdVencido += 1
      row.vencido += VALOR_POR_BOLETO
    }
  }

  return months
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; dataKey: string }>
  label?: string
  chartData?: MonthBoletoData[]
}

function CustomTooltip({ active, payload, label, chartData }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null

  const dataSource = chartData ?? MOCK_DATA
  const data = dataSource.find((d) => d.mes === label)
  if (!data) return null

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg min-w-[200px]">
      <div className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-2">
        {label}
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            Boletos pagos
          </span>
          <span className="font-medium text-gray-900">
            {data.qtdPago} un. · {formatBRL(data.pago)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            Boletos pendentes
          </span>
          <span className="font-medium text-gray-900">
            {data.qtdPendente} un. · {formatBRL(data.pendente)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            Boletos vencidos
          </span>
          <span className="font-medium text-gray-900">
            {data.qtdVencido} un. · {formatBRL(data.vencido)}
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
        Total do mês: {formatBRL(data.pago + data.pendente + data.vencido)}
      </div>
    </div>
  )
}

const FILTER_OPTIONS: { key: BoletoStatus; label: string; color: string }[] = [
  { key: 'pago', label: 'Pagos', color: COLORS.pago },
  { key: 'pendente', label: 'Pendentes', color: COLORS.pendente },
  { key: 'vencido', label: 'Vencidos', color: COLORS.vencido },
]

type BoletoPaymentsChartProps = {
  /** Solicitações com boleto enviado; quando informado, o gráfico é atualizado com base nelas */
  solicitacoes?: Solicitacao[]
}

export default function BoletoPaymentsChart({ solicitacoes = [] }: BoletoPaymentsChartProps) {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>({
    pago: true,
    pendente: true,
    vencido: true,
  })

  const chartData = useMemo(() => {
    const fromSolicitacoes = buildChartDataFromSolicitacoes(solicitacoes)
    const hasRealData = solicitacoes.some((s) => s.boletoPath || (s.boleto && typeof s.boleto === 'string'))
    return hasRealData ? fromSolicitacoes : MOCK_DATA
  }, [solicitacoes])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleFilter = (key: BoletoStatus) => {
    setFilter((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const isLastBar = (key: BoletoStatus) => {
    const order: BoletoStatus[] = ['pago', 'pendente', 'vencido']
    const visible = order.filter((k) => filter[k])
    return visible[visible.length - 1] === key
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Pagamentos de Boletos — Progresso do Contrato (12 meses)
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Evolução por status: pago, pendente e vencido
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full max-md:flex-col max-md:items-stretch max-md:gap-3">
            <span className="text-xs font-medium text-gray-500 max-md:w-full">Exibir:</span>
            <div className="flex flex-wrap items-center gap-2 max-md:grid max-md:grid-cols-3 max-md:gap-2 max-md:w-full">
              {FILTER_OPTIONS.map(({ key, label, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFilter(key)}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors max-md:py-2 max-md:min-h-[44px] ${
                    filter[key]
                      ? 'border-current text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                  style={filter[key] ? { backgroundColor: color, borderColor: color } : undefined}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-current opacity-90 shrink-0"
                    aria-hidden
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 pt-2">
        <div className="h-[340px] w-full min-h-[300px] min-w-[200px]">
          {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={300}>
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip chartData={chartData} />} cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }} />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
                iconType="circle"
                iconSize={10}
                align="center"
              />
              {filter.pago && (
                <Bar
                  dataKey="pago"
                  name="Boletos pagos"
                  stackId="a"
                  fill={COLORS.pago}
                  radius={isLastBar('pago') ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              )}
              {filter.pendente && (
                <Bar
                  dataKey="pendente"
                  name="Boletos pendentes"
                  stackId="a"
                  fill={COLORS.pendente}
                  radius={isLastBar('pendente') ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              )}
              {filter.vencido && (
                <Bar
                  dataKey="vencido"
                  name="Boletos vencidos"
                  stackId="a"
                  fill={COLORS.vencido}
                  radius={isLastBar('vencido') ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              )}
            </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full space-y-4">
              <Skeleton variant="rounded" height={24} width="60%" />
              <Skeleton variant="rounded" height={280} width="100%" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
