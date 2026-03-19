# Descomplica Celular

Plataforma web focada em **recomendação inteligente de smartphones**, construída para ajudar usuários a encontrarem o aparelho ideal com base em **orçamento, perfil de uso e prioridade principal**, de forma clara, acessível e explicável.

---

## 1. Visão geral do projeto

O **Descomplica Celular** nasceu com o objetivo de simplificar a decisão de compra de celulares, transformando uma escolha geralmente confusa em uma experiência guiada, objetiva e profissional.

A proposta do projeto é unir:

- **interface clara e moderna**;
- **motor de recomendação explicável**;
- **estrutura escalável**;
- **persistência de dados com Firebase**;
- **experiência orientada ao usuário**.

O sistema não foi pensado apenas como uma vitrine de aparelhos, mas como um **consultor digital**, capaz de interpretar o contexto do usuário e devolver uma recomendação coerente com seu perfil.

---

## 2. Objetivo principal

O principal objetivo do projeto é:

> ajudar usuários a identificarem o smartphone mais adequado para seu perfil de uso, orçamento e prioridade, por meio de uma recomendação técnica, compreensível e transparente.

---

## 3. Estado atual do projeto

O projeto está em processo de **profissionalização estrutural**, unificando aprendizados de duas versões anteriores:

- uma versão mais funcional, com Firebase, autenticação e dashboard;
- uma versão mais visual, com melhor apresentação de produto, vitrine e narrativa de interface.

A fase atual consiste em construir uma **nova base consolidada**, mais profissional, modular e preparada para crescimento.

---

## 4. Filosofia de desenvolvimento

Este projeto está sendo desenvolvido com base em uma filosofia de:

- **aprender programando**;
- evolução progressiva;
- modularização;
- clareza de arquitetura;
- separação de responsabilidades;
- melhoria contínua.

A ideia não é apenas fazer o sistema funcionar, mas também usar sua construção como trilha prática de formação em desenvolvimento web full stack.

---

## 5. Público-alvo do sistema

O projeto é voltado principalmente para:

- usuários que não dominam especificações técnicas de celulares;
- pessoas com orçamento limitado que querem acertar na compra;
- usuários que priorizam câmera, bateria, desempenho ou custo-benefício;
- clientes que querem uma orientação mais clara antes da compra.

---

## 6. Proposta de valor

O Descomplica Celular busca oferecer:

- recomendação orientada por perfil;
- comparação clara;
- linguagem acessível;
- explicação da recomendação;
- sensação de consultoria;
- futura evolução para histórico, preferências e personalização.

---

## 7. Stack principal do projeto

### Front-end
- HTML5
- CSS3
- JavaScript moderno (ES Modules)

### Back-end / Infraestrutura
- Firebase Authentication
- Cloud Firestore
- Firebase Analytics (opcional)
- futura possibilidade de App Check

### Ferramentas de desenvolvimento
- Visual Studio Code
- Git
- GitHub

---

## 8. Estrutura atual do projeto

```text
descomplica-celular/
├─ index.html
├─ dashboard.html
├─ login.html
├─ registro.html
├─ termos.html
├─ privacidade.html
│
├─ css/
│  ├─ tokens.css
│  ├─ global.css
│  ├─ layout.css
│  ├─ components.css
│  ├─ home.css
│  ├─ dashboard.css
│  └─ forms.css
│
├─ js/
│  ├─ firebase-config.js
│  ├─ auth.js
│  ├─ login.js
│  ├─ global-auth.js
│  ├─ home-controller.js
│  ├─ dashboard-controller.js
│  ├─ catalog-service.js
│  ├─ recommendation-engine.js
│  ├─ ui/
│  │  ├─ home-render.js
│  │  ├─ result-render.js
│  │  ├─ dashboard-render.js
│  │  └─ theme-manager.js
│  └─ utils/
│     ├─ validators.js
│     ├─ currency.js
│     ├─ dom.js
│     └─ storage.js
│
├─ data/
│  ├─ devices.json
│  ├─ profiles.json
│  └─ faq.json
│
└─ README.md
```

---

## 9. Arquitetura geral

A arquitetura atual foi pensada para seguir uma separação clara entre:

### 9.1 Dados
Arquivos em `data/` representam a base estática inicial da aplicação.

- `devices.json`: catálogo de aparelhos
- `profiles.json`: perfis de recomendação
- `faq.json`: perguntas frequentes

### 9.2 Serviços
Arquivos em `js/` que lidam com leitura, transformação e lógica de domínio.

- `catalog-service.js`: leitura e filtragem do catálogo
- `recommendation-engine.js`: motor de recomendação

### 9.3 Controladores
Arquivos que coordenam fluxo de página.

- `home-controller.js`: controla a home
- `dashboard-controller.js`: controla o painel
- `login.js`: controla login
- `auth.js`: controla cadastro
- `global-auth.js`: autenticação global e estado de navegação

### 9.4 Renderização
Arquivos em `js/ui/` responsáveis exclusivamente pela interface.

- `home-render.js`: catálogo, FAQ e mensagens gerais da home
- `result-render.js`: renderização especializada da recomendação
- `dashboard-render.js`: render do painel

### 9.5 Utilitários
Arquivos em `js/utils/` com funções reutilizáveis.

- `validators.js`: validações
- `currency.js`: parse e formatação monetária
- `dom.js`: helpers de interface
- `storage.js`: persistência local

---

## 10. Fluxo principal da aplicação

### 10.1 Home
Na home, o usuário:
1. informa orçamento;
2. escolhe um perfil de uso;
3. escolhe uma prioridade principal;
4. envia o formulário;
5. recebe uma recomendação com ranking e explicação.

### 10.2 Login e cadastro
Usuários podem:
- criar conta;
- autenticar-se;
- acessar dashboard;
- persistir histórico e preferências.

### 10.3 Dashboard
O dashboard foi pensado para:
- mostrar análises recentes;
- exibir métricas;
- mostrar tendências;
- reforçar valor percebido da plataforma.

---

## 11. Lógica do motor de recomendação

O sistema utiliza um modelo de **ranking ponderado**, onde cada aparelho recebe uma pontuação com base em critérios técnicos.

### Critérios principais:
- câmera
- desempenho
- bateria
- tela
- durabilidade
- longevidade
- custo-benefício

### Estrutura geral
Cada aparelho possui notas por critério em `devices.json`.

Cada perfil em `profiles.json` define:
- pesos;
- ordem de prioridade;
- descrição;
- foco recomendado;
- tom de explicação.

### Funcionamento
1. o usuário informa `budget`, `profileId` e `focusTag`;
2. o motor carrega os aparelhos e o perfil correspondente;
3. os pesos do perfil são ajustados pelo foco principal;
4. o sistema calcula score ponderado por aparelho;
5. os resultados são ordenados;
6. é gerado um ranking com explicação textual.

---

## 12. Princípios técnicos adotados

A nova fase do projeto foi organizada com base nos seguintes princípios:

### 12.1 Separação de responsabilidades
Cada arquivo deve ter uma função clara.

### 12.2 Evitar lógica duplicada
Validação, formatação e persistência foram centralizadas em utilitários.

### 12.3 Evolução incremental
O sistema está sendo construído em camadas:
- dados
- serviços
- renderização
- controladores
- páginas

### 12.4 Organização profissional
Mesmo em fase inicial, a estrutura busca refletir padrões de projeto reais.

---

## 13. Módulos implementados até o momento

### 13.1 Dados
- [x] `devices.json`
- [x] `profiles.json`
- [x] `faq.json`

### 13.2 Serviços
- [x] `catalog-service.js`
- [x] `recommendation-engine.js`

### 13.3 Renderização
- [x] `home-render.js`
- [x] `result-render.js`
- [x] `dashboard-render.js`

### 13.4 Utilitários
- [x] `validators.js`
- [x] `currency.js`
- [x] `dom.js`
- [x] `storage.js`

### 13.5 Controladores
- [x] `home-controller.js`
- [x] `dashboard-controller.js`
- [x] `login.js`
- [x] `auth.js`
- [x] `global-auth.js`

### 13.6 Infraestrutura
- [x] `firebase-config.js`

---

## 14. O que ainda falta concluir

A arquitetura base está avançando, mas ainda faltam etapas importantes para consolidação final.

### 14.1 Integração com HTML
Ainda é necessário religar corretamente:
- `index.html`
- `dashboard.html`
- `login.html`
- `registro.html`

aos novos módulos.

### 14.2 Ajuste de CSS
A estrutura de estilos existe, mas ainda precisa ser consolidada com:
- tokens visuais;
- padronização;
- remoção de inline styles;
- refinamento de responsividade.

### 14.3 Theme manager
`theme-manager.js` ainda deve ser implementado.

### 14.4 Segurança e produção
Futuras melhorias:
- Firestore Rules
- App Check
- proteção contra abuso
- revisão de fluxo autenticado
- tratamento melhor de erros
- sanitização adicional
- testes

### 14.5 Evolução de dados
O catálogo atual é estático e inicial. Futuramente pode ser:
- ampliado;
- versionado;
- persistido externamente;
- sincronizado com painel administrativo.

---

## 15. Páginas do projeto

### `index.html`
Página principal da aplicação. Deve conter:
- apresentação do projeto;
- formulário do consultor;
- catálogo;
- FAQ;
- CTA e navegação principal.

### `login.html`
Página de autenticação para entrada de usuários existentes.

### `registro.html`
Página de cadastro de novos usuários.

### `dashboard.html`
Painel do usuário autenticado com métricas e histórico.

### `termos.html`
Página jurídica de termos de uso.

### `privacidade.html`
Página jurídica de política de privacidade.

---

## 16. Responsabilidades dos principais arquivos

### `catalog-service.js`
Responsável por:
- carregar catálogo;
- filtrar dispositivos;
- buscar destaques;
- listar metadados do catálogo.

### `recommendation-engine.js`
Responsável por:
- carregar perfis;
- aplicar pesos;
- ranquear aparelhos;
- gerar explicações.

### `home-controller.js`
Responsável por:
- coordenar home;
- preencher selects;
- carregar FAQ e catálogo;
- processar formulário;
- armazenar rascunho local;
- chamar recomendação.

### `dashboard-controller.js`
Responsável por:
- validar sessão;
- buscar histórico do usuário;
- transformar dados em métricas;
- alimentar painel;
- processar refresh e logout.

### `global-auth.js`
Responsável por:
- refletir estado do usuário globalmente;
- controlar links protegidos;
- navegar entre páginas;
- exibir nome e mensagens flash.

---

## 17. Papel educacional do projeto

Este projeto também funciona como laboratório de formação prática em:

- HTML5
- CSS3
- JavaScript
- arquitetura front-end
- Firebase
- autenticação
- banco de dados
- lógica de recomendação
- organização profissional de código
- documentação

Ele está sendo utilizado como instrumento de aprendizado real em desenvolvimento web full stack.

---

## 18. Direção de aprendizagem associada ao projeto

O desenvolvimento do projeto deve caminhar junto com o estudo de:

- HTML semântico
- CSS responsivo
- JavaScript moderno
- manipulação de DOM
- modularização
- autenticação
- Firestore
- arquitetura de front-end
- lógica algorítmica
- documentação técnica

A proposta é aprender construindo, sem interromper a evolução do produto.

---

## 19. Convenções recomendadas

### Nomes de arquivos
- minúsculos
- sem espaços
- com hífen quando necessário

### Nomes de funções
- verbos claros
- responsabilidade única
- nome descritivo

### Organização de código
- evitar arquivos gigantes
- evitar misturar lógica com renderização
- evitar duplicação

### Fluxo de evolução
- implementar
- testar
- limpar
- documentar
- refatorar

---

## 20. Direção futura do produto

Possíveis evoluções futuras:

### Curto prazo
- religar HTMLs
- finalizar CSS
- estabilizar dashboard
- consolidar autenticação
- revisar dados do catálogo

### Médio prazo
- histórico de análises por usuário
- preferências salvas
- comparação avançada
- filtros extras
- favoritos

### Longo prazo
- integração com IA via backend seguro
- painel administrativo
- atualização dinâmica de catálogo
- recomendações ainda mais contextuais
- integração com links de compra

---

## 21. Segurança e boas práticas futuras

Pontos importantes para fases seguintes:
- nunca expor segredos sensíveis fora do contexto adequado;
- manter validação de entrada;
- revisar regras do Firestore;
- adicionar App Check;
- controlar abusos em endpoints futuros;
- evitar `innerHTML` desnecessário;
- revisar XSS e consistência de dados;
- usar ambientes separados para desenvolvimento e produção.

---

## 22. Observações importantes

- O projeto ainda está em consolidação.
- Parte da lógica já foi reestruturada para a nova fase.
- Parte do HTML/CSS ainda precisa ser religada à arquitetura nova.
- O projeto foi pensado para crescer progressivamente, sem quebrar a base.

---

## 23. Próxima prioridade recomendada

A próxima prioridade técnica mais importante é:

1. religar os HTMLs à nova arquitetura;
2. estabilizar a experiência completa da home;
3. estabilizar login, cadastro e dashboard;
4. revisar estilos e consistência visual;
5. preparar regras, segurança e deploy.

---

## 24. Resumo executivo

O **Descomplica Celular** está deixando de ser um protótipo híbrido e se tornando uma aplicação modular, explicável e escalável.

A nova arquitetura:
- centraliza dados;
- separa responsabilidades;
- organiza autenticação;
- melhora manutenção;
- fortalece a lógica de recomendação;
- cria base real para evolução profissional do projeto.

---

## 25. Autor e propósito

Projeto em desenvolvimento com foco simultâneo em:
- construção de produto;
- profissionalização de arquitetura;
- aprendizado prático de desenvolvimento web full stack.

---

## 26. Status atual

**Em reestruturação e consolidação arquitetural.**
