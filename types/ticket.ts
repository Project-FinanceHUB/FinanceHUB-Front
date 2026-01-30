export type TicketStatus = 'aberto' | 'pendente' | 'aguardando_validacao' | 'fechado'
export type TicketPriority = 'baixa' | 'media' | 'alta'
export type TicketStage = 'Pendente' | 'Em revisão' | 'Aguardando validação' | 'Fechado'

export type Ticket = {
  id: string
  numero: string
  titulo: string
  origem: string
  prioridade: TicketPriority
  status: TicketStatus
  estagio: TicketStage
  descricao?: string
  boleto?: File | string
  notaFiscal?: File | string
  dataCriacao?: string
  dataAtualizacao?: string
}

export type TicketFormData = Omit<Ticket, 'id' | 'dataCriacao' | 'dataAtualizacao'>
