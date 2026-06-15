export type SaudeRegistro = {
  id: string
  user_id: string
  data: string
  corpo: number | null
  mente: number | null
  nota: string | null
  marcado_medico: boolean
  created_at: string
  updated_at: string
}

export type Medicamento = {
  id: string
  user_id: string
  nome: string
  dosagem: string
  frequencia: string
  horarios: string[]
  estoque: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export type MedicamentoRegistro = {
  id: string
  user_id: string
  medicamento_id: string
  data: string
  horario_previsto: string
  tomado_em: string | null
  created_at: string
}

export type AgendaEvento = {
  id: string
  user_id: string
  titulo: string
  detalhes: string | null
  data: string
  hora: string | null
  categoria: 'medico' | 'psicologa' | 'estudos' | 'social' | 'missa' | 'outro'
  icone: string
  cor: 'terracota' | 'azul' | 'ambar' | 'salvia'
  created_at: string
  updated_at: string
}

export type Memoria = {
  id: string
  user_id: string
  titulo: string
  conteudo: string
  data_memoria: string
  categoria: 'familia' | 'praia' | 'faculdade' | 'fe' | 'outro'
  created_at: string
  updated_at: string
}
