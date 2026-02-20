'use client'

import { useState } from 'react'

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

const FAQ_ITEMS = [
  {
    id: 'solicitacoes',
    pergunta: 'O que são solicitações e como criar uma?',
    resposta: 'Solicitações são os registros que você envia para a FinanceHub (boletos, notas fiscais ou outras demandas). No Dashboard, use o botão "Nova solicitação" para criar. Preencha razão social, CNPJ, descrição e anexe o boleto ou documento quando necessário. Você pode acompanhar o status (pendente, em andamento, concluído) na tabela do Dashboard.',
  },
  {
    id: 'empresas',
    pergunta: 'Como gerencio minhas empresas e CNPJs?',
    resposta: 'Em "Gerenciar empresas" você cadastra e edita empresas: razão social e um ou mais CNPJs. Esses dados podem ser usados ao criar solicitações. Mantenha as informações atualizadas para evitar inconsistências nos envios.',
  },
  {
    id: 'historico',
    pergunta: 'Onde vejo o histórico de envios?',
    resposta: 'A página "Histórico" concentra o registro de solicitações, boletos e notas fiscais já enviados, com protocolo, data, horário e status. Use os filtros por tipo e status para localizar um envio específico.',
  },
  {
    id: 'boletos',
    pergunta: 'Como envio e acompanho boletos?',
    resposta: 'Ao criar uma solicitação, anexe o boleto no campo indicado. No Dashboard, o gráfico "Pagamentos de Boletos" mostra a evolução por status (pago, pendente, vencido) ao longo dos 12 meses do contrato. Você pode filtrar quais status exibir no gráfico.',
  },
  {
    id: 'suporte',
    pergunta: 'Como entro em contato com o suporte?',
    resposta: 'Acesse "Suporte" no menu. Lá você pode enviar mensagens, ver a caixa de entrada e as respostas do atendimento. As notificações no topo da tela indicam quando há novas mensagens. Você também pode enviar mensagens vinculadas a uma solicitação específica.',
  },
  {
    id: 'dashboard',
    pergunta: 'O que aparece no Dashboard?',
    resposta: 'O Dashboard exibe resumos como total de solicitações, pendentes, mensagens não lidas, o gráfico de evolução dos boletos (12 meses) e a tabela de solicitações com filtros por status (Todos abertos, Pendentes, Em andamento, Concluídos) e pesquisa por ID, razão social ou CNPJ.',
  },
  {
    id: 'configuracoes',
    pergunta: 'Como altero meus dados ou configurações?',
    resposta: 'Use "Configurações" no menu para acessar opções de conta e preferências. O ícone do seu avatar no canto superior direito permite visualizar perfil e sair da conta.',
  },
]

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={cn('w-5 h-5 text-gray-500 transition-transform duration-200', open && 'rotate-180')}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null)

  return (
    <div className="px-4 sm:px-6 py-6 md:py-8 w-full max-w-full">
      <div className="mb-6 md:mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/25">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Perguntas frequentes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tire dúvidas sobre solicitações, empresas, boletos, histórico e suporte.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className={cn(
                  'border-b border-gray-100 last:border-b-0',
                  isOpen && 'bg-gray-50/50'
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50/80 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-900 pr-2">{item.pergunta}</span>
                  <ChevronDown open={isOpen} />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200 ease-out',
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-5 pb-4 pt-0 text-sm text-gray-600 leading-relaxed">
                    {item.resposta}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
