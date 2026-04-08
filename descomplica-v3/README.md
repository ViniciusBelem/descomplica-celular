# Descomplica Celular V3 (React Edition)

A evolução do Descomplica Celular para uma arquitetura moderna, escalável e de alto desempenho.

## 🚀 Tecnologias
- **Frontend:** React + Vite + Tailwind CSS
- **Gestão de Estado:** Zustand
- **Backend/DB:** Supabase (PostgreSQL + Auth)
- **Internacionalização:** i18next
- **Ícones:** Lucide-React

## ⚙️ Configuração Inicial

### 1. Variáveis de Ambiente
Renomeie o arquivo `.env.example` para `.env` e preencha com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
```

### 2. Configurar Banco de Dados
Acesse o SQL Editor no painel do Supabase e execute o conteúdo do arquivo:
`../docs/supabase_schema.sql`

Este script irá criar a tabela `smartphones`, configurar as políticas de segurança (RLS) e inserir os dados iniciais.

### 3. Rodar o Projeto
```bash
npm install
npm run dev
```

## 📂 Estrutura de Pastas
- `/src/app`: Configurações globais e roteamento.
- `/src/components`: Componentes atômicos e complexos (Advisor, UI, Admin).
- `/src/lib`: Clientes de API (Supabase).
- `/src/pages`: Telas da aplicação (Home, Catalog, Detail, Admin).
- `/src/services`: Camada de lógica de dados e comunicação com banco.
- `/src/store`: Estado global (Auth, Advisor).

## 🛡️ Admin Panel
O acesso administrativo está disponível em `/admin` e requer autenticação.
- Gerencie o catálogo de aparelhos em tempo real.
- Edite scores, links de afiliados e tags de perfil.

---
**Desenvolvido para máxima usabilidade (99% usual).**
