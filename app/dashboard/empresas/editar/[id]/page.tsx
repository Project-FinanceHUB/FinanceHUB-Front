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
  const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white px-5 py-3 text-sm font-bold shadow-lg hover:bg-[var(--accent)] hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
  const btnSecondary = 'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200'

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
            Voltar para empresas
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Editar empresa</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Atualize as informações da empresa.
          </p>
        </div>

        {/* Formulário */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
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

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSave}
                className={btnPrimary}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Salvar alterações
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={btnSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
