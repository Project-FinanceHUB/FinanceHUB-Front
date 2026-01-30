'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import EmailInput from './EmailInput'

interface PasswordlessLoginProps {
  email: string
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBack?: () => void
}

export default function PasswordlessLogin({ email, onEmailChange }: PasswordlessLoginProps) {
  const router = useRouter()
  const emailInputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [erroEmail, setErroEmail] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val || '').trim())
  }

  const enviarCodigo = () => {
    setErroEmail('')
    const input = emailInputRef.current
    const emailValue = (input?.value ?? email ?? '').toString().trim()
    if (!isValidEmail(emailValue)) {
      setErroEmail('Digite um e-mail válido para continuar.')
      return
    }
    if (emailValue !== email) {
      onEmailChange({ target: { value: emailValue } } as React.ChangeEvent<HTMLInputElement>)
    }
    setEmailEnviado(emailValue)
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setCodeSent(true)
      setCountdown(60)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return

    setIsVerifying(true)
    
    // Simulate API call to verify code
    setTimeout(() => {
      setIsVerifying(false)
      router.push('/dashboard')
    }, 1000)
  }

  const handleResendCode = () => {
    if (countdown > 0) return
    setCodeSent(false)
    setCode('')
  }

  const handleChangeEmail = () => {
    setCodeSent(false)
    setCode('')
  }

  if (codeSent) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-light rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2 text-center">
            Verifique seu e-mail
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enviamos um código de 6 dígitos para <br />
            <span className="font-semibold text-gray-900">{emailEnviado || email}</span>
          </p>

          {/* Code Input Form */}
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {/* Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Código de verificação
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setCode(value)
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-[var(--primary)]"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Digite o código de 6 dígitos
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={code.length !== 6 || isVerifying}
              className="w-full py-3 px-4 bg-[var(--primary)] text-white font-semibold rounded-lg shadow-lg hover:bg-[var(--accent)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--primary)] transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isVerifying ? 'Verificando...' : 'Verificar código'}
            </button>

            {/* Resend Code & Change Email */}
            <div className="text-center space-y-2">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Não recebeu o código?
                </p>
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Reenviar em {countdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
                  >
                    Reenviar código
                  </button>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Alterar e-mail
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-light rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-6 sm:mb-8 text-center">
          Acessar conta
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Digite seu e-mail e enviaremos um código de verificação
        </p>

        <div
          className="space-y-6"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              enviarCodigo()
            }
          }}
        >
          <div>
            <EmailInput
              ref={emailInputRef}
              value={email}
              onChange={onEmailChange}
              isValid={email.length > 0 ? isValidEmail(email) : undefined}
            />
          </div>

          {erroEmail && (
            <p className="text-sm text-red-600 text-center">{erroEmail}</p>
          )}
          <button
            type="button"
            onClick={enviarCodigo}
            disabled={isSending}
            className="w-full py-3 px-4 bg-[var(--primary)] text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Enviando...' : 'Enviar código'}
          </button>
        </div>
      </div>
    </div>
  )
}
