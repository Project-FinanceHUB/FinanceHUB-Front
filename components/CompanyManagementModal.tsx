'use client'

import { useEffect, useState } from 'react'
import type { Company, CompanyFormData } from '@/types/company'

type CompanyManagementModalProps = {
  isOpen: boolean
  companies: Company[]
  onClose: () => void
  onCreate: (data: CompanyFormData) => void
  onUpdate: (id: string, data: CompanyFormData) => void
  onDelete: (id: string) => void
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function CompanyManagementModal({
  isOpen,
  companies,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: CompanyManagementModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [cnpjs, setCnpjs] = useState<string[]>([''])
  const [errors, setErrors] = useState<{ nome?: string; cnpjs?: string }>()

  useEffect(() => {
    if (!isOpen) {
      setEditingId(null)
      setNome('')
      setCnpjs([''])
      setErrors(undefined)
      return
    }

    // Quando abrir, se houver empresas, carrega a primeira para edição rápida
    if (companies.length > 0 && editingId === null) {
      const first = companies[0]
      setEditingId(first.id)
      setNome(first.nome)
      setCnpjs(first.cnpjs.length ? first.cnpjs : [''])
    }
  }, [isOpen, companies, editingId])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const resetForm = () => {
    setEditingId(null)
    setNome('')
    setCnpjs([''])
    setErrors(undefined)
  }

  const handleSelectCompany = (company: Company) => {
    setEditingId(company.id)
    setNome(company.nome)
    setCnpjs(company.cnpjs.length ? company.cnpjs : [''])
    setErrors(undefined)
  }

  const handleAddCnpjField = () => {
    setCnpjs((prev) => [...prev, ''])
  }

  const handleChangeCnpj = (index: number, value: string) => {
    setCnpjs((prev) => prev.map((c, i) => (i === index ? value : c)))
  }

  const handleRemoveCnpj = (index: number) => {
    setCnpjs((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const trimmedCnpjs = cnpjs.map((c) => c.trim()).filter(Boolean)
    const newErrors: { nome?: string; cnpjs?: string } = {}
    if (!nome.trim()) newErrors.nome = 'Nome da empresa é obrigatório'
    if (trimmedCnpjs.length === 0) newErrors.cnpjs = 'Informe ao menos um CNPJ válido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const data: CompanyFormData = {
      nome: nome.trim(),
      cnpjs: cnpjs.map((c) => c.trim()).filter(Boolean),
      ativo: true,
    }
    if (editingId) {
      onUpdate(editingId, data)
    } else {
      onCreate(data)
    }
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Tem certeza que deseja remover esta empresa?')) {
      return
    }
    onDelete(id)
    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Gerenciar empresas
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 overflow-hidden">
          {/* Lista de empresas */}
          <div className="p-4 sm:p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Empresas cadastradas</h3>
              <span className="text-xs text-gray-500">{companies.length} empresa(s)</span>
            </div>

            {companies.length === 0 && (
              <p className="text-sm text-gray-500">
                Nenhuma empresa cadastrada ainda. Use o formulário ao lado para criar a primeira.
              </p>
            )}

            <ul className="space-y-2">
              {companies.map((company) => (
                <li
                  key={company.id}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-sm flex items-start justify-between gap-3 cursor-pointer hover:bg-gray-50',
                    editingId === company.id ? 'border-[var(--primary)] bg-[var(--secondary)]/40' : 'border-gray-200'
                  )}
                  onClick={() => handleSelectCompany(company)}
                >
                  <div>
                    <div className="font-semibold text-gray-900">{company.nome}</div>
                    <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                      {company.cnpjs.map((cnpj) => (
                        <div key={cnpj}>{cnpj}</div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(company.id)
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    aria-label="Remover empresa"
                    title="Remover empresa"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulário de empresa */}
          <div className="p-4 sm:p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                {editingId ? 'Editar empresa' : 'Nova empresa'}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-medium text-[var(--primary)] hover:text-[var(--accent)]"
                >
                  + Nova empresa
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Razão Social <span className="text-red-500">*</span>
                </label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={cn(
                    'w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-white',
                    errors?.nome ? 'border-red-300' : 'border-gray-200',
                    'focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40'
                  )}
                  placeholder="Ex: Empresa Exemplo LTDA"
                />
                {errors?.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    CNPJs <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCnpjField}
                    className="text-xs font-medium text-[var(--primary)] hover:text-[var(--accent)]"
                  >
                    + Adicionar CNPJ
                  </button>
                </div>

                <div className="space-y-2">
                  {cnpjs.map((cnpj, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        value={cnpj}
                        onChange={(e) => handleChangeCnpj(index, e.target.value)}
                        className={cn(
                          'flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none bg-white',
                          errors?.cnpjs ? 'border-red-300' : 'border-gray-200',
                          'focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]/40'
                        )}
                        placeholder="Ex: 12.345.678/0001-90"
                      />
                      {cnpjs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCnpj(index)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          aria-label="Remover CNPJ"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors?.cnpjs && <p className="mt-1 text-xs text-red-600">{errors.cnpjs}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-[var(--accent)] transition"
                >
                  {editingId ? 'Salvar alterações' : 'Criar empresa'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

