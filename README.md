# Memória Viva — Preview de Design (standalone)

Projeto Next.js mínimo, isolado, criado apenas para visualizar o
redesign do Memória Viva. Não tem relação com o projeto real
(sem Supabase, sem services, sem hooks, sem schema).

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra no navegador:
   ```
   http://localhost:3000
   ```
   Você será redirecionado automaticamente para `/app-preview/dashboard`.

## Telas disponíveis

- `/app-preview/dashboard` — Home
- `/app-preview/agenda` — Agenda
- `/app-preview/medicamentos` — Meus remédios
- `/app-preview/memorias` — Memórias

Navegue entre elas pela barra inferior (bottom nav).

## Próximo passo

Depois de aprovar o visual, os arquivos dentro de `app/app-preview/`
(componentes, páginas, `preview-theme.css`) podem ser portados para o
projeto Memória Viva real, substituindo os dados mockados pelos dados
reais (Supabase / hooks / services existentes).
