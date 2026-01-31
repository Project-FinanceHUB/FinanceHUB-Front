'use client'

import { useState, useEffect } from 'react'
import type { Solicitacao, SolicitacaoFormData, SolicitacaoStatus } from '@/types/solicitacao'
import type { Company } from '@/types/company'
import FileUpload from './FileUpload'

/**
 * Gera um número de solicitação no formato FIN + 6 números aleatórios
 * Exemplo: FIN123456
 */
function generateSolicitacaoNumero(): string {
  const randomNumbers = Math.floor(100000 + Math.random() * 900000) // Gera número entre 100000 e 999999
  return `FIN${randomNumbers}`
}

type SolicitacaoFormProps = {
  solicitacao?: Solicitacao
  companies: Company[]
  onSubmit: (data: SolicitacaoFormData) => void
  onCancel: () => void
}

export default function SolicitacaoForm({ solicitacao, companies, onSubmit, onCancel }: SolicitacaoFormProps) {
  const isEditing = !!solicitacao

  const firstCompany = companies[0]

  const [formData, setFormData] = useState<SolicitacaoFormData>({
    numero: solicitacao?.numero || generateSolicitacaoNumero(),
    titulo: solicitacao?.titulo || firstCompany?.nome || '',
    origem: solicitacao?.origem || firstCompany?.cnpjs?.[0] || '',
    prioridade: solicitacao?.prioridade || 'media',
    status: solicitacao?.status || 'aberto',
    estagio: solicitacao?.estagio || 'Pendente',
    descricao: solicitacao?.descricao || '',
    boleto: solicitacao?.boleto || undefined,
    notaFiscal: solicitacao?.notaFiscal || undefined,
  })

  const [boletoFile, setBoletoFile] = useState<File | null>(null)
  const [notaFiscalFile, setNotaFiscalFile] = useState<File | null>(null)

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    () => companies.find((c) => c.nome === solicitacao?.titulo)?.id || firstCompany?.id || ''
  )

  const currentCompany = companies.find((c) => c.id === selectedCompanyId) || firstCompany

  const [errors, setErrors] = useState<Partial<Record<keyof SolicitacaoFormData, string>>>({})

  useEffect(() => {
    if (solicitacao) {
      setFormData({
        numero: solicitacao.numero,
        titulo: solicitacao.titulo,
        origem: solicitacao.origem,
        prioridade: solicitacao.prioridade,
        status: solicitacao.status,
        estagio: solicitacao.estagio,
        descricao: solicitacao.descricao || '',
      })
      setSelectedCompanyId(companies.find((c) => c.nome === solicitacao.titulo)?.id || firstCompany?.id || '')
    } else {
      setFormData((prev) => ({
        ...prev,
        numero: generateSolicitacaoNumero(),
        titulo: firstCompany?.nome || '',
        origem: firstCompany?.cnpjs?.[0] || '',
      }))
      setSelectedCompanyId(firstCompany?.id || '')
    }
  }, [solicitacao, companies])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SolicitacaoFormData, string>> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Razão Social é obrigatória'
    }
    if (!formData.origem.trim()) {
      newErrors.origem = 'CNPJ é obrigatório'
    }
    if (!isEditing) {
      if (!boletoFile) {
        newErrors.boleto = 'Boleto é obrigatório'
      }
      if (!notaFiscalFile) {
        newErrors.notaFiscal = 'Nota Fiscal é obrigatória'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...formData,
        boleto: boletoFile || undefined,
        notaFiscal: notaFiscalFile || undefined,
      })
    }
  }

  const handleChange = (field: keyof SolicitacaoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const statusOptions: Array<{ value: SolicitacaoStatus; label: string; color: string; bgColor: string }> = [
    { value: 'aberto', label: 'Aberto', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    { value: 'pendente', label: 'Pendente', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
    { value: 'aguardando_validacao', label: 'Aguardando Validação', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
    { value: 'aprovado', label: 'Aprovado', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
    { value: 'rejeitado', label: 'Rejeitado', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
    { value: 'concluido', label: 'Concluído', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
    { value: 'cancelado', label: 'Cancelado', color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200' },
    { value: 'fechado', label: 'Fechado', color: 'text-slate-700', bgColor: 'bg-slate-50 border-slate-200' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="empresa" className="block text-sm font-bold text-gray-900 mb-2">
            Empresa (Razão Social) <span className="text-red-500">*</span>
          </label>
          <select
            id="empresa"
            value={selectedCompanyId}
            onChange={(e) => {
              const company = companies.find((c) => c.id === e.target.value)
              setSelectedCompanyId(e.target.value)
              if (company) {
                const firstCnpj = company.cnpjs[0] || ''
                setFormData((prev) => ({
                  ...prev,
                  titulo: company.nome,
                  origem: firstCnpj,
                }))
              }
            }}
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 ${
              errors.titulo 
                ? 'border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
                : 'border-gray-200 bg-white hover:border-gray-300 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
            }`}
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.nome}
              </option>
            ))}
          </select>
          {errors.titulo && (
            <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.titulo}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cnpj" className="block text-sm font-bold text-gray-900 mb-2">
            CNPJ <span className="text-red-500">*</span>
          </label>
          <select
            id="cnpj"
            value={formData.origem}
            onChange={(e) => handleChange('origem', e.target.value)}
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none font-mono transition-all duration-200 ${
              errors.origem 
                ? 'border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
                : 'border-gray-200 bg-white hover:border-gray-300 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
            }`}
          >
            {(currentCompany?.cnpjs || []).map((cnpj) => (
              <option key={cnpj} value={cnpj}>
                {cnpj}
              </option>
            ))}
          </select>
          {errors.origem && (
            <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.origem}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="numero" className="block text-sm font-bold text-gray-900 mb-2">
          ID (gerado automaticamente)
        </label>
        <input
          id="numero"
          type="text"
          value={formData.numero}
          className="w-full rounded-xl border-2 border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed font-mono"
          disabled
          readOnly
        />
      </div>

      <input type="hidden" value={formData.titulo} readOnly />
      <input type="hidden" value={formData.origem} readOnly />

      <FileUpload
        label="Enviar Boleto"
        accept=".pdf,.jpg,.jpeg,.png"
        file={boletoFile}
        error={errors.boleto}
        required={!isEditing}
        onChange={(file) => {
          setBoletoFile(file)
          if (errors.boleto) {
            setErrors((prev) => ({ ...prev, boleto: undefined }))
          }
        }}
      />

      <FileUpload
        label="Enviar Nota Fiscal"
        accept=".pdf,.xml,.jpg,.jpeg,.png"
        file={notaFiscalFile}
        error={errors.notaFiscal}
        required={!isEditing}
        onChange={(file) => {
          setNotaFiscalFile(file)
          if (errors.notaFiscal) {
            setErrors((prev) => ({ ...prev, notaFiscal: undefined }))
          }
        }}
      />

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-3">
          Status <span className="text-gray-500 font-normal text-xs">(Selecione o status da solicitação)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {statusOptions.map((status) => {
            const isSelected = formData.status === status.value
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => handleChange('status', status.value)}
                className={`relative rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 text-left ${
                  isSelected
                    ? `${status.bgColor} ${status.color} border-current shadow-md scale-[1.02]`
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{status.label}</span>
                  {isSelected && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        <input
          type="hidden"
          id="status"
          value={formData.status}
          readOnly
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-5 py-3 text-sm font-bold shadow-lg hover:bg-[var(--accent)] hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {solicitacao ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Salvar alterações
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Criar solicitação
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
