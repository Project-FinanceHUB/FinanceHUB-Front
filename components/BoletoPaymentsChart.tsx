'use client'

import { useState, useRef, useEffect } from 'react'
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
  pago: '#2563eb',     // azul
  pendente: '#ea580c', // laranja
  vencido: '#dc2626',  // vermelho
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
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null

  const data = MOCK_DATA.find((d) => d.mes === label)
  if (!data) return null

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg min-w-[200px]">
      <div className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-2">
        {label}
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            Boletos pagos
          </span>
          <span className="font-medium text-gray-900">
            {data.qtdPago} un. · {formatBRL(data.pago)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
            Boletos pendentes
          </span>
          <span className="font-medium text-gray-900">
            {data.qtdPendente} un. · {formatBRL(data.pendente)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
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

export default function BoletoPaymentsChart() {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<StatusFilter>({
    pago: true,
    pendente: true,
    vencido: true,
  })
  const [anexos, setAnexos] = useState<File[]>([])
  const [protocoloEnviado, setProtocoloEnviado] = useState<string | null>(null)
  const [mostrarProtocolo, setMostrarProtocolo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleFilter = (key: BoletoStatus) => {
    setFilter((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAnexarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setAnexos((prev) => [...prev, ...Array.from(files)])
    e.target.value = ''
  }

  const removeAnexo = (index: number) => {
    setAnexos((prev) => prev.filter((_, i) => i !== index))
  }

  const gerarProtocolo = (): string => {
    const ano = new Date().getFullYear()
    const seq = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0')
    return `BOL-${ano}-${seq}`
  }

  const handleEnviarBoletos = () => {
    if (anexos.length === 0) return
    const protocolo = gerarProtocolo()
    setProtocoloEnviado(protocolo)
    setMostrarProtocolo(true)
    setAnexos([])
  }

  const copiarProtocolo = () => {
    if (!protocoloEnviado) return
    navigator.clipboard.writeText(protocoloEnviado)
  }

  const fecharProtocolo = () => {
    setMostrarProtocolo(false)
    setProtocoloEnviado(null)
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
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro por status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Exibir:</span>
              {FILTER_OPTIONS.map(({ key, label, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFilter(key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter[key]
                      ? 'border-current text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                  style={filter[key] ? { backgroundColor: color, borderColor: color } : undefined}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-current opacity-90"
                    aria-hidden
                  />
                  {label}
                </button>
              ))}
            </div>
            {/* Botão anexar boletos vencidos */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleAnexarClick}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Anexar boletos vencidos
            </button>
          </div>
        </div>
        {/* Lista de anexos + botão enviar */}
        {anexos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Boletos vencidos anexados:</p>
            <ul className="flex flex-wrap gap-2 mb-3">
              {anexos.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                >
                  <span className="truncate max-w-[180px]" title={file.name}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAnexo(index)}
                    className="text-gray-400 hover:text-red-600 p-0.5 rounded"
                    aria-label="Remover anexo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleEnviarBoletos}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Enviar boletos
            </button>
          </div>
        )}
      </div>

      {/* Modal com protocolo de atendimento */}
      {mostrarProtocolo && protocoloEnviado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="protocolo-title"
          onClick={fecharProtocolo}
        >
          <div
            className="rounded-2xl bg-white shadow-xl max-w-md w-full p-6 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 id="protocolo-title" className="text-lg font-semibold text-gray-900">
                  Boletos enviados
                </h3>
                <p className="text-sm text-gray-500">
                  Guarde seu protocolo para acompanhar o atendimento.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Protocolo de atendimento</p>
              <p className="text-xl font-mono font-semibold text-gray-900 tracking-wide">
                {protocoloEnviado}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Use este número como referência ao falar com o suporte ou consultar o status do seu envio na área de tickets.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={copiarProtocolo}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar protocolo
              </button>
              <button
                type="button"
                onClick={fecharProtocolo}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-5 pt-2">
        <div className="h-[340px] w-full min-h-[300px] min-w-[200px]">
          {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={300}>
            <BarChart
              data={MOCK_DATA}
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(3, 154, 66, 0.06)' }} />
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
            <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
              Carregando gráfico...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
