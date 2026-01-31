import apiConfig from '../api'
import type { Company, CompanyFormData } from '@/types/company'

const API_URL = apiConfig.baseURL

export async function getCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_URL}/api/companies`)
  if (!response.ok) {
    throw new Error('Erro ao buscar empresas')
  }
  const result = await response.json()
  return result.data || result
}

export async function createCompany(data: CompanyFormData): Promise<Company> {
  const response = await fetch(`${API_URL}/api/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao criar empresa' }))
    throw new Error(error.message || 'Erro ao criar empresa')
  }
  const result = await response.json()
  return result.data || result
}

export async function updateCompany(id: string, data: Partial<CompanyFormData>): Promise<Company> {
  const response = await fetch(`${API_URL}/api/companies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao atualizar empresa' }))
    throw new Error(error.message || 'Erro ao atualizar empresa')
  }
  const result = await response.json()
  return result.data || result
}

export async function deleteCompany(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/companies/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao deletar empresa' }))
    throw new Error(error.message || 'Erro ao deletar empresa')
  }
}
