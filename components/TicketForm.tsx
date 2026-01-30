'use client'

import { useState, useEffect } from 'react'
import type { Ticket, TicketFormData, TicketStatus } from '@/types/ticket'
import type { Company } from '@/types/company'
import FileUpload from './FileUpload'

type TicketFormProps = {
  ticket?: Ticket
  companies: Company[]
  onSubmit: (data: TicketFormData) => void
  onCancel: () => void
}

export default function TicketForm({ ticket, companies, onSubmit, onCancel }: TicketFormProps) {
  const isEditing = !!ticket

  const firstCompany = companies[0]

  const [formData, setFormData] = useState<TicketFormData>({
    // ID automático quando criando, mantido quando editando
    numero: ticket?.numero || Date.now().toString(),
    // Razão Social
    titulo: ticket?.titulo || firstCompany?.nome || '',
    // CNPJ
    origem: ticket?.origem || firstCompany?.cnpjs?.[0] || '',
    // Mantém campos não usados na UI com valores padrão
    prioridade: ticket?.prioridade || 'media',
    status: ticket?.status || 'aberto',
    estagio: ticket?.estagio || 'Pendente',
    descricao: ticket?.descricao || '',
    boleto: ticket?.boleto || undefined,
    notaFiscal: ticket?.notaFiscal || undefined,
  })

  const [boletoFile, setBoletoFile] = useState<File | null>(null)
  const [notaFiscalFile, setNotaFiscalFile] = useState<File | null>(null)

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    () => companies.find((c) => c.nome === ticket?.titulo)?.id || firstCompany?.id || ''
  )

  const currentCompany = companies.find((c) => c.id === selectedCompanyId) || firstCompany

  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({})

  useEffect(() => {
    if (ticket) {
      setFormData({
        numero: ticket.numero,
        titulo: ticket.titulo,
        origem: ticket.origem,
        prioridade: ticket.prioridade,
        status: ticket.status,
        estagio: ticket.estagio,
        descricao: ticket.descricao || '',
      })
      setSelectedCompanyId(companies.find((c) => c.nome === ticket.titulo)?.id || firstCompany?.id || '')
    } else {
      // Novo ticket: garante um ID/numero automático e preenche com primeira empresa/CNPJ
      setFormData((prev) => ({
        ...prev,
        numero: Date.now().toString(),
        titulo: firstCompany?.nome || '',
        origem: firstCompany?.cnpjs?.[0] || '',
      }))
      setSelectedCompanyId(firstCompany?.id || '')
    }
  }, [ticket, companies])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TicketFormData, string>> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Razão Social é obrigatória'
    }
    if (!formData.origem.trim()) {
      newErrors.origem = 'CNPJ é obrigatório'
    }
    // Arquivos são obrigatórios apenas ao criar novo ticket
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

  const handleChange = (field: keyof TicketFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Empresa e CNPJ (baseados no cadastro de empresas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="empresa" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40"
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cnpj" className="block text-sm font-semibold text-gray-700 mb-1.5">
            CNPJ <span className="text-red-500">*</span>
          </label>
          <select
            id="cnpj"
            value={formData.origem}
            onChange={(e) => handleChange('origem', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40"
          >
            {(currentCompany?.cnpjs || []).map((cnpj) => (
              <option key={cnpj} value={cnpj}>
                {cnpj}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="numero" className="block text-sm font-semibold text-gray-700 mb-1.5">
          ID (gerado automaticamente)
        </label>
        <input
          id="numero"
          type="text"
          value={formData.numero}
          className={`w-full rounded-xl border ${
            errors.numero ? 'border-red-300' : 'border-gray-200'
          } bg-gray-100 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed`}
          disabled
          readOnly
        />
        {errors.numero && <p className="mt-1 text-xs text-red-600">{errors.numero}</p>}
      </div>

      {/* Campos derivados, apenas para validação/consistência (ocultos visualmente) */}
      <input type="hidden" value={formData.titulo} readOnly />
      <input type="hidden" value={formData.origem} readOnly />

      {/* Campo de upload - Boleto */}
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

      {/* Campo de upload - Nota Fiscal */}
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
        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value as TicketStatus)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40"
        >
          <option value="aberto">Aberto</option>
          <option value="pendente">Pendente</option>
          <option value="aguardando_validacao">Aguardando validação</option>
          <option value="fechado">Fechado</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-[var(--accent)] transition"
        >
          {ticket ? 'Salvar alterações' : 'Criar ticket'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
