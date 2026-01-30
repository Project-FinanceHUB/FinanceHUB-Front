'use client'

import DashboardShell from '@/components/DashboardShell'
import { DashboardProvider } from '@/context/DashboardContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  )
}
