'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useHistorico } from '@/context/HistoricoContext'
import type { HistoricoFormData, HistoricoTipo, HistoricoStatus } from '@/types/historico'

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

export default function EditarRegistroPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const {
    registros,
    updateRegistro,
  } = useHistorico()

  const [form, setForm] = useState<HistoricoFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && registros.length > 0) {
      const registro = registros.find((r) => r.id === id)
      if (registro) {
        setForm({
          tipo: registro.tipo,
          categoria: registro.categoria,
          protocolo: registro.protocolo,
          data: registro.data,
          horario: registro.horario,
          status: registro.status,
          titulo: registro.titulo,
          descricao: registro.descricao ?? '',
          origem: registro.origem ?? '',
          cnpj: registro.cnpj ?? '',
          valor: registro.valor ?? '',
          observacoes: registro.observacoes ?? '',
        })
      } else {
        router.push('/dashboard/historico')
      }
      setLoading(false)
    }
  }, [id, registros, router])

  const validate = () => {
    const err: Record<string, string> = {}
    if (!form.protocolo.trim()) err.protocolo = 'Protocolo é obrigatório'
    if (!form.titulo.trim()) err.titulo = 'Título é obrigatório'
    if (!form.data.trim()) err.data = 'Data é obrigatória'
    if (!form.horario.trim()) err.horario = 'Horário é obrigatório'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const cat = form.tipo === 'boleto' ? 'Boleto' : form.tipo === 'nota_fiscal' ? 'Nota Fiscal' : 'Ação'
    const data = { ...form, categoria: form.categoria || cat }
    updateRegistro(id, data)
    router.push('/dashboard/historico')
  }

  const handleCancel = () => {
    router.push('/dashboard/historico')
  }

  const inputBase = 'w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-white border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40'
  const inputError = 'border-red-300'
  const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition'
  const btnSecondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition'

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 py-6 w-full max-w-full">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para histórico
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Editar registro</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Atualize as informações do registro do histórico.
          </p>
        </div>

        {/* Formulário */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select
                  value={form.tipo}
                  onChange={(e) => {
                    const v = e.target.value as HistoricoTipo
                    setForm((f) => ({
                      ...f,
                      tipo: v,
                      categoria: v === 'boleto' ? 'Boleto' : v === 'nota_fiscal' ? 'Nota Fiscal' : 'Ação',
                    }))
                  }}
                  className={inputBase}
                >
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as HistoricoStatus }))}
                  className={inputBase}
                >
                  {STATUS_OPTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo *</label>
              <input
                value={form.protocolo}
                onChange={(e) => setForm((f) => ({ ...f, protocolo: e.target.value }))}
                className={cn(inputBase, errors.protocolo && inputError)}
                placeholder="Ex: BOL-2025-001234"
              />
              {errors.protocolo && <p className="mt-1 text-xs text-red-600">{errors.protocolo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                className={cn(inputBase, errors.titulo && inputError)}
                placeholder="Ex: Boleto - BOL-2025-001234"
              />
              {errors.titulo && <p className="mt-1 text-xs text-red-600">{errors.titulo}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                  className={cn(inputBase, errors.data && inputError)}
                />
                {errors.data && <p className="mt-1 text-xs text-red-600">{errors.data}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                <input
                  type="time"
                  value={form.horario}
                  onChange={(e) => setForm((f) => ({ ...f, horario: e.target.value }))}
                  className={cn(inputBase, errors.horario && inputError)}
                />
                {errors.horario && <p className="mt-1 text-xs text-red-600">{errors.horario}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                className={cn(inputBase, 'min-h-[100px]')}
                placeholder="Descrição ou detalhes do registro"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origem / CNPJ</label>
                <input
                  value={form.origem || form.cnpj}
                  onChange={(e) => setForm((f) => ({ ...f, origem: e.target.value, cnpj: e.target.value }))}
                  className={inputBase}
                  placeholder="Ex: 12.345.678/0001-90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input
                  value={form.valor}
                  onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                  className={inputBase}
                  placeholder="Ex: R$ 1.250,00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={form.observacoes}
                onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
                className={cn(inputBase, 'min-h-[80px]')}
                placeholder="Observações adicionais"
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={handleSave} className={btnPrimary}>
                Salvar alterações
              </button>
              <button type="button" onClick={handleCancel} className={btnSecondary}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
