export type SolicitacaoStatus = 'aberto' | 'pendente' | 'aguardando_validacao' | 'fechado'
export type SolicitacaoPriority = 'baixa' | 'media' | 'alta'
export type SolicitacaoStage = 'Pendente' | 'Em revisão' | 'Aguardando validação' | 'Fechado'

export type Solicitacao = {
  id: string
  numero: string
  titulo: string
  origem: string
  prioridade: SolicitacaoPriority
  status: SolicitacaoStatus
  estagio: SolicitacaoStage
  descricao?: string
  boleto?: File | string
  notaFiscal?: File | string
  dataCriacao?: string
  dataAtualizacao?: string
}

export type SolicitacaoFormData = Omit<Solicitacao, 'id' | 'dataCriacao' | 'dataAtualizacao'>
