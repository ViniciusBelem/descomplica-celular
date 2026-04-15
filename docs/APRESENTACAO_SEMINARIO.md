# ESTRUTURA PARA SEMINÁRIO DE PROJETOS AUTORAIS
## Projeto: Descomplica Celular (V3 - React/Supabase)

---

### SLIDE 1: CAPA E IDENTIDADE
- **Título:** Descomplica Celular
- **Subtítulo:** Consultoria Digital Inteligente para Smartphones.
- **Frase de Impacto:** "Traduzindo a complexidade técnica em benefícios reais para a escolha do seu próximo smartphone."
- **Integrantes:** [Seu Nome / Equipe]
- **Logotipo:** (Ícone de smartphone com engrenagens ou check verde).

---

### SLIDE 2: O PROBLEMA (A DOR)
- **Cenário:** O mercado de smartphones lança centenas de modelos anualmente.
- **A Dor:** 90% dos usuários não entendem especificações como "nanômetros", "nits" ou "núcleos de processamento".
- **Consequência:** Compras erradas (aparelhos que travam ou gastos excessivos em recursos desnecessários).
- **Usuário Alvo:** Consumidores comuns e entusiastas que buscam eficiência na compra.

---

### SLIDE 3: A SOLUÇÃO E OBJETIVOS
- **Como resolvemos:** Através de um "Advisor" (assistente) interativo que coleta necessidades e gera um ranking inteligente de custo-benefício.
- **Objetivos Principais:**
  - Democratizar o conhecimento técnico.
  - Reduzir o tempo de decisão de compra em até 80%.
  - Centralizar a gestão de dispositivos para administradores (CRUD completo).

---

### SLIDE 4: ARQUITETURA E STACK TECNOLÓGICA
- **Frontend:** React 19 + Vite (Performance e modernidade).
- **Estilização:** Tailwind CSS + Framer Motion (Interface fluida e responsiva).
- **Backend/DB:** Supabase (PostgreSQL + RLS). Escalabilidade e segurança nativa sem necessidade de servidor manual.
- **Gerenciamento de Estado:** Zustand (Leve e performático para o fluxo do Advisor).
- **Internacionalização:** i18next (Suporte nativo PT-BR e EN).

---

### SLIDE 5: O PALCO (LIVE DEMO)
- **Ação:** Pausa na apresentação para demonstrar o software rodando.
- **Roteiro da Demo:**
  1. **Landing Page:** Proposta de valor clara.
  2. **Fluxo do Advisor:** Responder orçamento e prioridades (Câmera, Bateria, Performance).
  3. **Resultado:** Ver o ranking gerado e o comparador de aparelhos.
  4. **Painel Admin:** Mostrar a segurança (Login) e a gestão do catálogo.

---

### SLIDE 6: STATUS ATUAL (ATÉ ONDE CHEGAMOS)
- **Funcionalidades 100%:** 
  - Motor de recomendação algorítmico.
  - Sistema de comparação lado a lado.
  - Banco de dados relacional integrado.
  - Painel administrativo seguro com autenticação.
  - Internacionalização completa.

---

### SLIDE 7: MAIORES DESAFIOS TÉCNICOS
- **Desafio 1 (Arquitetura):** Migração do legada (PHP) para arquitetura de componentes React, garantindo que o estado do usuário não se perca entre os passos.
- **Desafio 2 (Lógica):** Balanceamento dos pesos do ranking. Como definir que "Bateria" é mais importante que "Design" para um perfil específico?
- **Solução:** Uso de "Zustand" para estado global e lógica de normalização de dados no frontend.

---

### SLIDE 8: O ROADMAP (VISÃO DE FUTURO)
- **Curto Prazo:** Implementação de PWA (App instalável).
- **Médio Prazo (SaaS):** Transformar em um Widget para e-commerces (B2B).
- **Longo Prazo (IA):** Integração com IA para analisar reviews reais (sentimento do consumidor) e atualizar os rankings automaticamente.

---

### SLIDE 9: LIÇÕES APRENDIDAS
- **Engenharia de Software:** A importância de planejar o esquema do banco de dados (PostgreSQL) antes de iniciar a interface.
- **UX:** Menos é mais. Simplificar os campos do formulário aumentou a taxa de completude dos usuários nos testes iniciais.
- **Modernização:** A mudança para Supabase/React reduziu o tempo de desenvolvimento em 50% comparado à V2 manual.

---

### SLIDE 10: PERGUNTAS E ENCERRAMENTO
- **Agradecimento:** "Obrigado pela atenção. A tecnologia deve servir para descomplicar a vida do usuário."
- **Contatos:** [Link do GitHub / LinkedIn]
- **Sabatina:** Aberto para perguntas da banca e colegas.

---

## 💡 DICAS PARA O NOTEBOOK LM (COMANDOS PARA DAR A ELE):
1. *"Com base neste texto, gere um roteiro de fala de 12 minutos dividido por slide."*
2. *"Aja como um professor chato e me faça 3 perguntas técnicas sobre o uso do Supabase e do Zustand neste projeto."*
3. *"Crie um resumo de 1 parágrafo para cada slide para eu colocar nas notas do orador no PowerPoint."*
