# Plano de Refatoração: Descomplica Celular (Branch Development)

Auditoria completa realizada em **38 arquivos** do projeto. O plano abaixo está ordenado por **prioridade de execução** (crítico → importante → melhoria).

---

## 1. ELIMINAR — Código morto, controllers duplicados e imports desnecessários

### 1.1 `home-controller.js` — Controller Obsoleto (PRIORIDADE: CRÍTICA)
- **O que remover:** O arquivo `js/home-controller.js` por completo.
- **Por que é seguro:** Nenhuma tag `<script>` em nenhum HTML o referencia. O `index.html` já usa a versão v2. A versão v1 é legado abandonado.
- **Critério:** O arquivo deve ser deletado.

### 1.2 `dashboard-controller.js` — Controller Obsoleto (PRIORIDADE: CRÍTICA)
- **O que remover:** O arquivo `js/dashboard-controller.js` por completo.
- **Por que é seguro:** A view `dashboard.html` usa exclusivamente o v2 (`dashboard-controller-v2.js`). O v1 tenta fazer queries diretas e usa código obsoleto.
- **Critério:** O arquivo deve ser deletado.

### 1.3 `firebase-service.js` — Imports duplicados na linha 21 (PRIORIDADE: ALTA)
- **O que está errado:** A linha 21 reimporta funções do Firestore (`getDoc`, `doc`, `updateDoc`, etc.) sob aliases desnecessários (`fireGetDoc`, `fireDoc`, etc.), causando confusão de pacotes.
- **Como corrigir:** Remover linha 21 e padronizar o uso sob a única importação original no início do arquivo.

### 1.4 `home-controller-v2.js` — Import não utilizado de `onAuthStateChanged` (PRIORIDADE: BAIXA)
- **O que está errado:** Está escutando a alteração de auth apenas para dar `console.log`, consumindo processamento inútil.
- **Como corrigir:** Remover para deixar essa responsabilidade apenas com `global-auth.js`.

---

## 2. REFATORAR — Código que funciona mas está mal estruturado

### 2.1 Duplicação de `escapeHtml()` e `resolveElement()` em 3 renders (PRIORIDADE: ALTA)
- **O que está errado:** As funções de segurança estão repetidas em `home-render.js`, `result-render.js` e `dashboard-render.js`.
- **Como corrigir:** Remover essas funções copiadas e importá-las corretamente do arquivo canônico `utils/security.js`.

### 2.2 Duplicação de `normalizeText()` em `validators.js` (PRIORIDADE: ALTA)
- **O que está errado:** O arquivo tem sua própria `normalizeText` que só faz `.trim()`, diferindo da normalização real que o motor usa (remoção de acentos/lowerCase).
- **Como corrigir:** Renomear a função para `trimValue()` para deixar claro a diferença.

### 2.3 Inconsistência de nomenclatura nos `focusTags` (PRIORIDADE: ALTA) 
- **O que está errado:** Dados misturam português (`bateria`) com o banco em inglês (`battery`). 
- **Como corrigir:** Manter a camada atual por compatibilidade do banco, mas adicionar comentários claros de conversão em PT-BR para ES, validando segurança no motor.

### 2.4 Ausência da animação Pipeline no Home (v2) (PRIORIDADE: MÉDIA)
- **O que está errado:** O `home-v2` não chama visualização de "processing" ao carregar recomendação (só fica nos skeletons).
- **Como corrigir:** Re-implementar o acionamento simultâneo do Pipeline que existia na v1.

### 2.5 Riscos no `admin-controller.js` e Segurança Visual (PRIORIDADE: MÉDIA)
- **O que está errado:** Risco de vazar HTML malicioso via injeção sem tratamento no painel admin (ex: imagens com payload XSS). Polling `setInterval` da Caixa de Entrada acumula (memory leak).
- **Como corrigir:** Aplicar `escapeHtml` às tabelas, adicionar e controlar perfeitamente o ID de `clearInterval()` no loop de leitura de mensagens não lidas.

### 2.6 Escapar conteúdo em `toast.js` (PRIORIDADE: BAIXA)
- **O que está errado:** Render de innerHTML dinâmico desprotegido.
- **Como corrigir:** Tratamento de string limpa para todos os títulos e mensagens das notificações.

---

## 3. REESCREVER DO ZERO — Módulos custosos de refatorar

### 3.1 `enhanced-select.js` — Funcionalidade de Seletores Customizados (PRIORIDADE: ALTA)
- **O que está errado:** Reimplementa selects de forma frágil, acumulando eventListeners globais (1 por input!). Fica obsoleto e quebra ao sofrer alterações de opção dinamicamente. Sem suporte de teclado (Acessibilidade)
- **Como corrigir:** Re-escrever para funcionar apenas com CSS/JS limpo: controle por um único MutationObserver, navegação por tabindex (teclado), e sem listener duplicado.

### 3.2 `message-service.js` (PRIORIDADE: ALTA)
- **O que está errado:** Hard-Delete imposto em anotações de auditoria em um sistema que prevê soft-delete, validação pífia do input, e varredura total por mensagens da lixeira em vez de query limpa no backend.
- **Como corrigir:** Validação de ponta a ponta com erros claros, implementação do Soft Delete correto (lixeira de 15 dias), e sanitizer do corpo HTML para afastar XSS.

---

## 4. PRESERVAR — Código aprovado pela auditoria ✅
- **Design:** Tokens `tokens.css` funcionam brilhantemente de forma isolada e em cascata.
- **AI Core:** Motor de prioridades (`recommendation-engine.js`), sua arquitetura lidou com pesos/regras de negócio maravilhosamente bem.
- **Firestore DB:** `CatalogRepository` foi modelado de forma excelente com logs contínuos e lixeiras (soft-delete).
- Páginas HTML com boa divisão de blocos BEM e SEO limpo. 

---

### Perguntas em Aberto antes de começarmos:

1. **FocusTags (bateria vs battery):** Eu documentarei apenas que a conversão acontece. Porém, se preferir, eu posso unificar tudo para Inglês puro no lado dos dados ou manter como está. **Mantenho a mescla atual em segurança (já que tem fallback de compatibilidade) ou forço o Inglês puro?**
2. **Seletores Modificados (`enhanced-select`):** Para re-escrever ele, você quer que eu o deixe **100% igual visualmente**, corrigindo apenas como o interior técnico "fala" com a tela e seus listeners, certo?
3. **Escopo de Execução:** Posso executar todos os passos desse plano de uma única vez em blocos ordenados das prioridades *críticas para as menores*?
