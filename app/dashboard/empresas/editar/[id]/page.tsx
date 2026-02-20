'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDashboard } from '@/context/DashboardContext'
import type { CompanyFormData } from '@/types/company'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function EditarEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const { companies, setCompanies } = useDashboard()

  const [nome, setNome] = useState('')
  const [cnpjs, setCnpjs] = useState<string[]>([''])
  const [errors, setErrors] = useState<{ nome?: string; cnpjs?: string }>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && companies.length > 0) {
      const company = companies.find((c) => c.id === id)
      if (company) {
        setNome(company.nome)
        setCnpjs(company.cnpjs.length ? company.cnpjs : [''])
      } else {
        router.push('/dashboard/empresas')
      }
      setLoading(false)
    }
  }, [id, companies, router])

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

  const handleSave = () => {
    if (!validate()) return
    const data: CompanyFormData = {
      nome: nome.trim(),
      cnpjs: cnpjs.map((c) => c.trim()).filter(Boolean),
      ativo: true,
    }
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
    router.push('/dashboard/empresas')
  }

  const handleCancel = () => {
    router.push('/dashboard/empresas')
  }

  const inputBase = 'w-full rounded-xl border-2 px-4 py-3 text-sm outline-none bg-white transition-all duration-200'
  const inputError = 'border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-200 focus:border-red-400'
  const inputNormal = 'border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'
  const btnPrimary =
    'inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white px-5 py-3 text-sm font-bold shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
  const btnSecondary =
    'inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200'

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 py-6 md:py-8 w-full max-w-full bg-gradient-to-b from-gray-50 to-gray-100/40">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6 md:mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 min-h-[44px] rounded-xl px-2 -ml-2 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para empresas
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/25">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Editar empresa</h1>
              <p className="text-sm text-gray-500 mt-0.5">Atualize as informações da empresa.</p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Dados da empresa</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Altere razão social e CNPJs conforme necessário para manter seus dados sempre atualizados.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center rounded-full border border-[var(--primary)]/15 bg-[var(--primary)]/5 px-3 py-1 text-[11px] font-semibold text-[var(--primary)]">
              Edição em tempo real
            </span>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
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
                  <p className="mt-2 text-xs text-gray-500">Use a razão social completa da empresa, igual ao cadastro oficial.</p>
                  {errors?.nome && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
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
                  <p className="mt-2 text-xs text-gray-500">
                    Você pode cadastrar múltiplos CNPJs para a mesma empresa. Use apenas números ou o formato com pontuação.
                  </p>
                  {errors?.cnpjs && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.cnpjs}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-2">
                <button type="button" onClick={handleSave} className={btnPrimary}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
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
    </div>
  )
}
