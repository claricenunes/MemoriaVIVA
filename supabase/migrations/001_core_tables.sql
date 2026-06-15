-- Memória Viva — Tabelas principais
-- Execute no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/[seu-projeto]/sql/new

-- ───────────────────────────────────────────────
-- Trigger updated_at
-- ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ───────────────────────────────────────────────
-- SAÚDE — Check-in diário
-- ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saude_registros (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data           DATE        NOT NULL DEFAULT CURRENT_DATE,
  corpo          SMALLINT    CHECK (corpo BETWEEN 1 AND 10),
  mente          SMALLINT    CHECK (mente BETWEEN 1 AND 10),
  nota           TEXT,
  marcado_medico BOOLEAN     NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, data)
);

CREATE OR REPLACE TRIGGER saude_registros_updated_at
  BEFORE UPDATE ON saude_registros
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

ALTER TABLE saude_registros ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saude_registros: acesso proprio" ON saude_registros;
CREATE POLICY "saude_registros: acesso proprio"
  ON saude_registros FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────
-- MEDICAMENTOS — Cadastro
-- ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicamentos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT        NOT NULL,
  dosagem     TEXT        NOT NULL,
  frequencia  TEXT        NOT NULL,
  horarios    TEXT[]      NOT NULL DEFAULT '{}',
  estoque     INTEGER     NOT NULL DEFAULT 0,
  ativo       BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER medicamentos_updated_at
  BEFORE UPDATE ON medicamentos
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "medicamentos: acesso proprio" ON medicamentos;
CREATE POLICY "medicamentos: acesso proprio"
  ON medicamentos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────
-- MEDICAMENTOS_REGISTROS — Histórico de tomadas
-- ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicamentos_registros (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medicamento_id   UUID        NOT NULL REFERENCES medicamentos(id) ON DELETE CASCADE,
  data             DATE        NOT NULL DEFAULT CURRENT_DATE,
  horario_previsto TEXT        NOT NULL,
  tomado_em        TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (medicamento_id, data, horario_previsto)
);

ALTER TABLE medicamentos_registros ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "medicamentos_registros: acesso proprio" ON medicamentos_registros;
CREATE POLICY "medicamentos_registros: acesso proprio"
  ON medicamentos_registros FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
