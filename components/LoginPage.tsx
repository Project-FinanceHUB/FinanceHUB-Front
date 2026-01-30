'use client'

import LoginForm from './LoginForm'
import BrandingPanel from './BrandingPanel'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <BrandingPanel />
      
      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[var(--background)] min-h-screen">
        <LoginForm />
      </div>
    </div>
  )
}
