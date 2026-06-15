-- Memória Viva — Agenda e Memórias
-- Execute no Supabase SQL Editor APÓS 001_core_tables.sql
-- A função fn_set_updated_at() já existe da migração anterior.

-- ─────────────────────────────────────────────────
-- AGENDA_EVENTOS — Compromissos e consultas
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agenda_eventos (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo     TEXT        NOT NULL,
  detalhes   TEXT,
  data       DATE        NOT NULL,
  hora       TIME,
  categoria  TEXT        NOT NULL DEFAULT 'outro',
  -- medico | psicologa | estudos | social | missa | outro
  icone      TEXT        NOT NULL DEFAULT 'calendar',
  cor        TEXT        NOT NULL DEFAULT 'azul',
  -- terracota | azul | ambar | salvia
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER agenda_eventos_updated_at
  BEFORE UPDATE ON agenda_eventos
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

ALTER TABLE agenda_eventos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agenda_eventos: acesso proprio" ON agenda_eventos;
CREATE POLICY "agenda_eventos: acesso proprio"
  ON agenda_eventos FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────
-- MEMORIAS — Recordações pessoais
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memorias (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo       TEXT        NOT NULL,
  conteudo     TEXT        NOT NULL,
  data_memoria TEXT        NOT NULL,
  -- texto livre: "Verão de 1998", "Dezembro de 2010"
  categoria    TEXT        NOT NULL DEFAULT 'outro',
  -- familia | praia | faculdade | fe | outro
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER memorias_updated_at
  BEFORE UPDATE ON memorias
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

ALTER TABLE memorias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "memorias: acesso proprio" ON memorias;
CREATE POLICY "memorias: acesso proprio"
  ON memorias FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
