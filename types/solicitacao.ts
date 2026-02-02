export type SolicitacaoStatus = 
  | 'aberto' 
  | 'pendente' 
  | 'em_andamento' 
  | 'aguardando_validacao' 
  | 'aprovado' 
  | 'rejeitado' 
  | 'concluido' 
  | 'cancelado' 
  | 'fechado'
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
  mensagem?: string
  boleto?: File | string
  notaFiscal?: File | string
  visualizado?: boolean
  visualizadoEm?: string
  respondido?: boolean
  respondidoEm?: string
  dataCriacao?: string
  dataAtualizacao?: string
}

export type SolicitacaoFormData = Omit<Solicitacao, 'id' | 'dataCriacao' | 'dataAtualizacao'>
