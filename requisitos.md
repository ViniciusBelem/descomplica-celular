# Requisitos do Sistema — Descomplica Celular

## 📌 Visão Geral
O Descomplica Celular é um consultor digital inteligente desenvolvido em PHP que auxilia usuários na escolha do smartphone ideal com base em suas necessidades reais, utilizando um assistente interativo e um algoritmo de ranking ponderado.

---

# ✅ Requisitos Funcionais

RF01 - O sistema deve permitir que o usuário responda a um assistente interativo (wizard) para identificar seu perfil de uso.

RF02 - O sistema deve processar as respostas do usuário e gerar recomendações de smartphones com base em critérios definidos.

RF03 - O sistema deve exibir um ranking de aparelhos conforme o perfil e orçamento informado.

RF04 - O sistema deve apresentar selos de experiência para facilitar a compreensão dos benefícios dos dispositivos.

RF05 - O sistema deve possuir autenticação para acesso ao painel administrativo.

RF06 - O administrador deve poder cadastrar novos smartphones no sistema.

RF07 - O administrador deve poder editar informações e notas técnicas dos aparelhos.

RF08 - O administrador deve poder excluir registros do catálogo.

RF09 - O sistema deve permitir importação em lote de dados via arquivos estruturados (CSV/JSON).

RF10 - O sistema deve armazenar e consultar dados em banco relacional utilizando PDO.

---

# ⚙️ Requisitos Não Funcionais

RNF01 - O sistema deve possuir interface responsiva para diferentes tamanhos de tela.

RNF02 - O tempo de carregamento das páginas principais deve ser inferior a 2 segundos em condições normais.

RNF03 - O sistema deve utilizar Prepared Statements para prevenção contra SQL Injection.

RNF04 - O acesso ao painel administrativo deve ser restrito a usuários autenticados.

RNF05 - O código deve seguir organização modular para facilitar manutenção e escalabilidade.

RNF06 - O sistema deve ser compatível com navegadores modernos.

RNF07 - O sistema deve manter consistência visual e usabilidade intuitiva.

---

# 👤 Histórias de Usuário (User Stories)

US01 - Como cliente, eu quero responder perguntas simples sobre meu uso, para receber recomendações adequadas.

US02 - Como cliente, eu quero visualizar rapidamente os pontos fortes do aparelho, para decidir com segurança.

US03 - Como administrador, eu quero gerenciar o catálogo de smartphones, para manter o sistema atualizado.

US04 - Como administrador, eu quero importar vários aparelhos de uma vez, para economizar tempo na gestão.

US05 - Como usuário, eu quero receber recomendações claras sem precisar entender termos técnicos.


