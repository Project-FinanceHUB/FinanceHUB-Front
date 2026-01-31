'use client'

import { Skeleton } from './Skeleton'

interface LoadingButtonProps {
  isLoading?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function LoadingButton({
  isLoading = false,
  children,
  className = '',
  disabled = false,
  variant = 'primary',
}: LoadingButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--accent)] shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-[var(--primary)]/5',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl',
  }
  
  if (isLoading) {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span className="opacity-75">{children}</span>
      </div>
    )
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
    >
      {children}
    </button>
  )
}
