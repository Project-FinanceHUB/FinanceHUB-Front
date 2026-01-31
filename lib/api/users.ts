import apiConfig from '../api'
import type { User, UserFormData } from '@/types/configuracoes'

const API_URL = apiConfig.baseURL

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/api/users`)
  if (!response.ok) {
    throw new Error('Erro ao buscar usuários')
  }
  const result = await response.json()
  return result.data || result
}

export async function createUser(data: UserFormData): Promise<User> {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  const result = await response.json().catch(() => ({ error: 'Erro ao processar resposta' }))
  
  if (!response.ok) {
    // Se houver detalhes de validação (Zod), mostrar o primeiro erro
    if (result.details && Array.isArray(result.details) && result.details.length > 0) {
      throw new Error(result.details[0].message || result.error || 'Dados inválidos')
    }
    throw new Error(result.error || result.message || 'Erro ao criar usuário')
  }
  
  return result.data || result
}

export async function updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao atualizar usuário' }))
    throw new Error(error.message || 'Erro ao atualizar usuário')
  }
  const result = await response.json()
  return result.data || result
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao deletar usuário' }))
    throw new Error(error.message || 'Erro ao deletar usuário')
  }
}
