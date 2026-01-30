'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SolicitacaoModal from '@/components/SolicitacaoModal'
import CompanyManagementModal from '@/components/CompanyManagementModal'
import ConfiguracoesModal from '@/components/ConfiguracoesModal'
import HistoricoModal from '@/components/HistoricoModal'
import SuporteModal from '@/components/SuporteModal'
import NotificacoesDropdown from '@/components/NotificacoesDropdown'
import Footer from '@/components/Footer'
import { useDashboard } from '@/context/DashboardContext'
import { useSuporte } from '@/context/SuporteContext'
import type { CompanyFormData } from '@/types/company'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function Icon({ name, className }: { name: string; className?: string }) {
  const cls = cn('w-5 h-5', className)
  switch (name) {
    case 'dashboard':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z" fill="currentColor" />
        </svg>
      )
    case 'bill':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1-2-1V3Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.5 8h7M8.5 11h7M8.5 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 18h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'bell':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" fill="currentColor" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M19.4 15a7.97 7.97 0 0 0 .1-1 7.97 7.97 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a8 8 0 0 0-1.7-1l-.4-2.6H10l-.4 2.6a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L5.6 13a7.97 7.97 0 0 0-.1 1c0 .34.03.67.1 1L3.6 16.6l2 3.4 2.4-1a8 8 0 0 0 1.7 1l.4 2.6h4.2l.4-2.6a8 8 0 0 0 1.7-1l2.4 1 2-3.4L19.4 15Z" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    case 'plus':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'menu':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'lancamentos':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'historico':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'suporte':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'companies':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return <span className={cls} aria-hidden="true" />
  }
}

function SidebarItem({
  icon,
  label,
  href,
  onClick,
  active,
  isCollapsed,
  onMobileClick,
}: {
  icon: string
  label: string
  href?: string
  onClick?: () => void
  active?: boolean
  isCollapsed?: boolean
  onMobileClick?: () => void
}) {
  const baseClass = cn(
    'w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group',
    active ? 'bg-white/15 text-white shadow-sm' : 'text-white/85 hover:text-white hover:bg-white/10',
    isCollapsed ? 'justify-center' : 'gap-3'
  )
  const content = (
    <>
      <span className={cn('flex-shrink-0', active ? 'opacity-100' : 'opacity-90')}>
        <Icon name={icon} />
      </span>
      {!isCollapsed && <span className="truncate">{label}</span>}
      {isCollapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg">
          {label}
        </span>
      )}
    </>
  )
  if (href) {
    return (
      <Link href={href} onClick={onMobileClick} className={baseClass} title={isCollapsed ? label : undefined}>
        {content}
      </Link>
    )
  }
  const handleClick = () => {
    onClick?.()
    onMobileClick?.()
  }
  return (
    <button type="button" onClick={handleClick} className={baseClass} title={isCollapsed ? label : undefined}>
      {content}
    </button>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { companies, setCompanies, addSolicitacao, companiesModalOpen, setCompaniesModalOpen } = useDashboard()
  const { mensagens } = useSuporte()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSolicitacaoModalOpen, setIsSolicitacaoModalOpen] = useState(false)
  const [isNotificacoesOpen, setIsNotificacoesOpen] = useState(false)

  const mensagensNaoLidas = mensagens.filter((m) => !m.lida && m.direcao === 'recebida').length

  const handleNotificacaoClick = () => {
    setIsNotificacoesOpen(!isNotificacoesOpen)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-brand-5 text-gray-900">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={cn(
            'flex flex-col fixed inset-y-0 bg-gradient-to-b from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] text-white transition-all duration-300 z-50 overflow-x-hidden',
            'w-72',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
            'md:translate-x-0',
            isSidebarCollapsed ? 'md:w-20' : 'md:w-72'
          )}
        >
          <div className={cn('h-16 flex items-center border-b border-white/10 transition-all duration-300', isSidebarCollapsed ? 'md:px-3 md:justify-center px-6 gap-3' : 'px-6 gap-3')}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ring-1 ring-white/15 flex-shrink-0 overflow-hidden">
              <Image src="/logo.png" alt="FinanceHub Logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            {!isSidebarCollapsed && (
              <div className="leading-tight">
                <div className="font-semibold">FinanceHub</div>
                <div className="text-xs text-white/70">Painel do Cliente</div>
              </div>
            )}
          </div>

          <div className={cn('transition-all duration-300', isSidebarCollapsed ? 'md:p-2 p-4' : 'p-4')}>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsSolicitacaoModalOpen(true)
              }}
              className={cn(
                'w-full inline-flex items-center rounded-xl border border-[var(--primary)] bg-white text-[var(--primary)] font-semibold shadow-sm hover:bg-[var(--secondary)] transition relative group',
                isSidebarCollapsed ? 'md:justify-center md:px-2 md:gap-0 gap-2 px-4 py-3' : 'justify-center gap-2 px-4 py-3'
              )}
              title={isSidebarCollapsed ? 'Abrir nova solicitação' : undefined}
            >
              <Icon name="plus" className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Abrir nova solicitação</span>}
              {isSidebarCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  Abrir nova solicitação
                </span>
              )}
            </button>
          </div>

          <nav className={cn('flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300', isSidebarCollapsed ? 'md:px-2 px-4' : 'px-4')}>
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Gestão Financeira
                </div>
              )}
              <SidebarItem icon="dashboard" label="Dashboard" href="/dashboard" active={pathname === '/dashboard'} isCollapsed={isSidebarCollapsed} onMobileClick={() => setIsMobileMenuOpen(false)} />
              <SidebarItem icon="lancamentos" label="Lançamentos Financeiros" href="/dashboard/lancamentos" active={pathname === '/dashboard/lancamentos'} isCollapsed={isSidebarCollapsed} onMobileClick={() => setIsMobileMenuOpen(false)} />
              <SidebarItem icon="historico" label="Histórico" href="/dashboard/historico" active={pathname === '/dashboard/historico'} isCollapsed={isSidebarCollapsed} onMobileClick={() => setIsMobileMenuOpen(false)} />
              <SidebarItem icon="companies" label="Gerenciar empresas" onClick={() => setCompaniesModalOpen(true)} isCollapsed={isSidebarCollapsed} onMobileClick={() => setIsMobileMenuOpen(false)} />
            </div>

            <div className={cn('mt-auto pt-4 pb-6 space-y-1', !isSidebarCollapsed && 'border-t border-white/10')}>
              {!isSidebarCollapsed && (
                <div className="px-3 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Conta e Suporte
                </div>
              )}
              <SidebarItem icon="suporte" label="Suporte" href="/dashboard/suporte" active={pathname === '/dashboard/suporte'} isCollapsed={isSidebarCollapsed} onMobileClick={() => setIsMobileMenuOpen(false)} />
              <SidebarItem icon="settings" label="Configurações" href="/dashboard/configuracoes" active={pathname === '/dashboard/configuracoes'} isCollapsed={isSidebarCollapsed} onMobileClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </nav>
        </aside>

        <main className={cn('flex-1 transition-all duration-300 w-full flex flex-col', isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72')}>
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
            <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                aria-label={isSidebarCollapsed ? 'Expandir menu' : 'Colapsar menu'}
                title={isSidebarCollapsed ? 'Expandir menu' : 'Colapsar menu'}
              >
                <Icon name="menu" className="w-5 h-5 text-gray-700" />
              </button>

              <div className="md:hidden flex items-center gap-3">
                <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50" aria-label="Menu">
                  <Icon name="menu" className="w-5 h-5 text-gray-700" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="FinanceHub Logo" width={40} height={40} className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleNotificacaoClick}
                    className={cn(
                      'relative inline-flex items-center justify-center w-10 h-10 rounded-xl border transition',
                      isNotificacoesOpen
                        ? 'border-[var(--primary)] bg-[var(--secondary)]/30'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    )}
                    aria-label="Notificações do suporte"
                    title={mensagensNaoLidas > 0 ? `${mensagensNaoLidas} mensagem(ns) não lida(s)` : 'Notificações'}
                  >
                    <span className="text-gray-600">
                      <Icon name="bell" />
                    </span>
                    {mensagensNaoLidas > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs font-semibold flex items-center justify-center">
                        {mensagensNaoLidas}
                      </span>
                    )}
                  </button>
                  <NotificacoesDropdown isOpen={isNotificacoesOpen} onClose={() => setIsNotificacoesOpen(false)} />
                </div>
                <button type="button" className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white flex items-center justify-center font-semibold">B</div>
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="text-sm font-semibold">Brendow</div>
                    <div className="text-xs text-gray-500">Cliente</div>
                  </div>
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1">
            {children}
          </div>

          <Footer />
        </main>
      </div>

      <SolicitacaoModal
        isOpen={isSolicitacaoModalOpen}
        companies={companies}
        onClose={() => setIsSolicitacaoModalOpen(false)}
        onSubmit={(formData) => {
          addSolicitacao(formData)
          setIsSolicitacaoModalOpen(false)
        }}
      />

      <CompanyManagementModal
        isOpen={companiesModalOpen}
        companies={companies}
        onClose={() => setCompaniesModalOpen(false)}
        onCreate={(data: CompanyFormData) => {
          setCompanies((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
        }}
        onUpdate={(id, data) => {
          setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
        }}
        onDelete={(id) => {
          setCompanies((prev) => prev.filter((c) => c.id !== id))
        }}
      />

      <ConfiguracoesModal />
      <HistoricoModal />
      <SuporteModal />
    </div>
  )
}
