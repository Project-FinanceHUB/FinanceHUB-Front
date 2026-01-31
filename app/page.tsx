'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import HeroSection from '@/components/HeroSection'
import LoginPage from '@/components/LoginPage'

export default function Home() {
  const searchParams = useSearchParams()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Se houver parâmetro 'login' na URL, mostrar página de login
    if (searchParams?.get('login') === 'true') {
      setShowLogin(true)
    }
  }, [searchParams])

  if (showLogin) {
    return <LoginPage />
  }

  return <HeroSection />
}
