'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from './LoginForm'
import BrandingPanel from './BrandingPanel'
import Footer from './Footer'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const cadastroSucesso = searchParams?.get('cadastro')

  useEffect(() => {
    if (cadastroSucesso === 'sucesso') {
      // Mostrar mensagem de sucesso temporariamente
      const timer = setTimeout(() => {
        // Mensagem já será mostrada pelo componente
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [cadastroSucesso])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Panel - Branding */}
        <BrandingPanel />
        
        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[var(--background)]">
          <div className="w-full max-w-md">
            {cadastroSucesso === 'sucesso' && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 text-center">
                  ✅ Conta criada com sucesso! Faça login para continuar.
                </p>
              </div>
            )}
            <LoginForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
