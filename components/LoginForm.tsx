'use client'

import { useState } from 'react'
import PasswordlessLogin from './PasswordlessLogin'

export default function LoginForm() {
  const [email, setEmail] = useState('')

  return (
    <PasswordlessLogin
      email={email}
      onEmailChange={(e) => setEmail(e.target.value)}
      onBack={() => {}}
    />
  )
}
