'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/context/DashboardContext'
import type { CompanyFormData } from '@/types/company'
import * as companyAPI from '@/lib/api/companies'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function EmpresasPage() {
  const router = useRouter()
  const { companies, setCompanies } = useDashboard()
  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [cnpjs, setCnpjs] = useState<string[]>([''])
  const [errors, setErrors] = useState<{ nome?: string; cnpjs?: string }>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  const resetForm = () => {
    setNome('')
    setCnpjs([''])
    setErrors(undefined)
    setSubmitError(null)
  }

  const handleOpenModal = () => {
    resetForm()
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/empresas/editar/${id}`)
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

  const handleSubmit = async () => {
    if (!validate()) return
    const data: CompanyFormData = {
      nome: nome.trim(),
      cnpjs: cnpjs.map((c) => c.trim()).filter(Boolean),
      ativo: true,
    }
    setSubmitLoading(true)
    setSubmitError(null)
    try {
      const created = await companyAPI.createCompany(data)
      setCompanies((prev) => [...prev, created])
      handleCloseModal()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar empresa.'
      setSubmitError(message)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Tem certeza que deseja remover esta empresa?')) {
      return
    }
    try {
      await companyAPI.deleteCompany(id)
      setCompanies((prev) => prev.filter((c) => c.id !== id))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao remover empresa.'
      if (typeof window !== 'undefined') window.alert(message)
    }
  }

  const inputBase = 'w-full rounded-xl border-2 px-4 py-3 text-sm outline-none bg-white transition-all duration-200'
  const inputError = 'border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-200 focus:border-red-400'
  const inputNormal = 'border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
  const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-5 py-3 text-sm font-bold shadow-lg hover:bg-[var(--accent)] hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
  const btnSecondary = 'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200'

  return (
    <div className="px-4 sm:px-6 py-6 w-full max-w-full">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gerenciar empresas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cadastre e gerencie empresas e CNPJs
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova empresa
        </button>
      </div>

      {/* Layout principal */}
      <div className="w-full max-w-full">
        {/* Lista de empresas */}
        <div className="w-full max-w-full">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden w-full max-w-full">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Empresas cadastradas {mounted ? `(${companies.length})` : ''}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Selecione uma empresa para editar</p>
                </div>
              </div>
            </div>
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto p-4">
              {!mounted ? (
                <div className="p-8 text-center">
                  <div className="text-sm text-gray-500">Carregando...</div>
                </div>
              ) : companies.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Nenhuma empresa cadastrada ainda
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Use o formulário ao lado para criar a primeira
                  </p>
                </div>
              ) : (
                <>
                  {/* Cards para Mobile e Tablet */}
                  <div className="lg:hidden space-y-3">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="rounded-xl border-2 border-gray-200 bg-white hover:border-[var(--primary)]/30 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 px-4 py-3.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900">
                              {company.nome}
                            </div>
                            <div className="mt-1.5 space-y-1">
                              {company.cnpjs.map((cnpj) => (
                                <div key={cnpj} className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded inline-block">
                                  {cnpj}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEdit(company.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-[var(--primary)] hover:bg-[rgba(3,154,66,0.08)] transition-all duration-200"
                              aria-label="Editar empresa"
                              title="Editar empresa"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(company.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                              aria-label="Remover empresa"
                              title="Remover empresa"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                            Razão Social
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            CNPJs
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {companies.map((company) => (
                          <tr
                            key={company.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3">
                              <div className="text-sm font-semibold text-gray-900">{company.nome}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1.5">
                                {company.cnpjs.map((cnpj) => (
                                  <span key={cnpj} className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">
                                    {cnpj}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(company.id)}
                                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-[var(--primary)] hover:bg-[rgba(3,154,66,0.08)] flex items-center justify-center transition"
                                  title="Editar empresa"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(company.id)}
                                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                                  title="Remover empresa"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
      </div>

      {/* Modal Nova Empresa */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true" />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Nova empresa</h2>
                <p className="text-sm text-gray-500 mt-0.5">Preencha os dados para criar uma nova empresa</p>
              </div>
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
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Razão Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={cn(inputBase, errors?.nome ? inputError : inputNormal)}
                    placeholder="Ex: Empresa Exemplo LTDA"
                  />
                  {errors?.nome && (
                    <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.nome}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      CNPJs <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCnpjField}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:text-[var(--accent)] transition-colors px-2.5 py-1 rounded-lg hover:bg-[var(--primary)]/5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Adicionar CNPJ
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cnpjs.map((cnpj, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          value={cnpj}
                          onChange={(e) => handleChangeCnpj(index, e.target.value)}
                          className={cn(
                            'flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none bg-white font-mono transition-all duration-200',
                            errors?.cnpjs ? inputError : inputNormal
                          )}
                          placeholder="12.345.678/0001-90"
                        />
                        {cnpjs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCnpj(index)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                            aria-label="Remover CNPJ"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors?.cnpjs && (
                    <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.cnpjs}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {submitError && (
              <div className="mx-6 mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {submitError}
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitLoading}
                className={btnPrimary}
              >
                {submitLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Criando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Criar empresa
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className={btnSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
