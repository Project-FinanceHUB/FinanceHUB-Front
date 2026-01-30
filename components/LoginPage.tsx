'use client'

import LoginForm from './LoginForm'
import BrandingPanel from './BrandingPanel'
import Footer from './Footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Panel - Branding */}
        <BrandingPanel />
        
        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[var(--background)]">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
