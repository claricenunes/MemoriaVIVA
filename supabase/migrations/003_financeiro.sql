-- Memória Viva — Módulo Financeiro
-- Execute no Supabase SQL Editor

-- ───────────────────────────────────────────────
-- FINANCEIRO — Movimentações
-- ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS financeiro_transacoes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descricao  TEXT        NOT NULL,
  valor      NUMERIC(12,2) NOT NULL,  -- positivo = entrada, negativo = saída
  categoria  TEXT        NOT NULL,
  emoji      TEXT        NOT NULL DEFAULT '💳',
  data       DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE financeiro_transacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "financeiro_transacoes: acesso proprio" ON financeiro_transacoes;
CREATE POLICY "financeiro_transacoes: acesso proprio"
  ON financeiro_transacoes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────
-- FINANCEIRO — Contas a pagar
-- ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS financeiro_contas (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label       TEXT        NOT NULL,
  vencimento  DATE        NOT NULL,
  valor       NUMERIC(12,2) NOT NULL,
  paga        BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE financeiro_contas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "financeiro_contas: acesso proprio" ON financeiro_contas;
CREATE POLICY "financeiro_contas: acesso proprio"
  ON financeiro_contas FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
