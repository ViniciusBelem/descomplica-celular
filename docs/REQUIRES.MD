Aula
Criando seu Repositório no Github
Conteúdo
- Introdução ao Git e GitHub

- Criação de repositório no GitHub

- Fluxo básico: git add, git commit, git push

- Submissão de tarefas na plataforma LabSIS

Objetivos de Aprendizagem
Ao final desta aula, espera-se que você seja capaz de:

- Criar um repositório no GitHub para seu projeto

- Executar o fluxo básico de versionamento com Git

- Submeter suas tarefas corretamente na plataforma LabSIS
Atividades
1. Criar uma Conta no GitHub (se necessário)
Se ainda não possui uma conta:

1.1 Acesse github.com

1.2 Clique em Sign up

1.3 Preencha os seus dados (use o seu e-mail institucional se possível)

1.4 Confirme o seu e-mail Vídeo complementar: https://www.youtube.com/watch?v=ry0pV3eFTaw

2. Criar um repositório para o seu projeto
2.1 Caso não possua um nome para o seu projeto, escolha um nome fictício por agora
Vídeo Complementar: https://www.youtube.com/watch?v=m_6f3r-fwsE

3. Configurando Chaves SSH no Linux (Atualizado conforme Doc Oficial)
Este processo permite conectar-se ao GitHub sem fornecer o seu nome de utilizador e token de acesso pessoal a cada visita.

Assista ao Vídeo complementar para compreender o processo: https://youtu.be/tA-dRupFnTE

4. Clonar e Fazer o seu Primeiro Commit
Abra o terminal e execute os comandos abaixo. Nota: Como configurou o SSH, utilize o link SSH (começa com git@) para clonar, garantindo que a autenticação automática funcione.

4.1 Clone o repositório para a sua máquina

git clone git@github.com:seu-usuario/seu-repositorio.git
4.2 Entre na pasta do projeto

cd seu-repositorio
4.3 Crie um arquivo README.md (ou edite o existente)

echo "# Meu Projeto LabSIS" >> README.md
4.4 Adicione o arquivo ao Git

git add README.md
4.5 Faça o commit

git commit -m "Primeiro commit: Adiciona README"
4.6 Envie para o GitHub

git push origin main
5. Obtendo o Link e Hash do Commit
Para submeter a sua tarefa no LabSIS:

5.1 Link do Repositório: É a URL do seu repositório (ex: https://github.com/seu-usuario/meu-projeto-labsis)

5.2 Hash do Commit Execute no terminal:

git log -1 --format="%H"
O resultado será um código longo (ex: a1b2c3d...).

6. Submetendo no LabSIS
6.1 Acesse a plataforma LabSIS (https://labsis.dev.br/login)

6.2 Navegue até a secção de Lições e localize esta aula

6.3 Clique em Finalizar

6.4 Preencha:

URL do Github: O link do seu repositório

Hash do Commit: O código obtido no passo 5.2

Dificuldades/Sugestões: O seu feedback sobre a aula

6.5 Confirme a submissão

Aula
Elaboração de requisitos de Software
Conteúdo
A. O que são Requisitos?
Imagine construir uma casa. O requisito funcional é "ter três quartos". O requisito não funcional é "a casa deve resistir a ventos de 100km/h". No software:

Funcionais: O que o sistema faz (ex: "O sistema deve permitir o cadastro de clientes").

Não Funcionais: Como o sistema se comporta (ex: "O sistema deve carregar em menos de 2 segundos").

B. O Processo de Elicitação
É a arte de "investigar" o que o cliente quer (e o que ele realmente precisa, que nem sempre é a mesma coisa).

Entrevistas e Questionários.

Brainstorming.

Análise de similares.

C. Escrita de Histórias de Usuário (User Stories)
Uma forma simples de documentar:

Como [papel], eu quero [ação], para que [benefício].

Objetivos de Aprendizagem
Ao final desta lição, o aluno espera-se que o aluno seja capaz de:

Diferenciar Requisitos Funcionais de Não Funcionais.

Identificar as necessidades do usuário e traduzi-las em especificações técnicas.

Utilizar um Agente de IA como parceiro de brainstorming e refinamento de escopo.

Documentar requisitos de forma clara e sem ambiguidades.

Atividades
Nesta etapa, você não falarão com um professor, mas sim com um Agente de IA especializado em Product Management.

Passo 1: O Briefing (O Problema)
Você deverá utilizar as acessar os detalhes do seu projeto e repassar apresentar ao agente de IA o contexto do seu projeto.

Acesse os detalhes do seu projeto, e informe ao agente de IA o conteúdo textual descrito nas seções: Sobre o Projeto e O que ele resolve

Passo 2: A Interação com o Agente

Acesse o agente no pelo link: https://gemini.google.com/gem/1WP1hD4qMSqAfRWU4YemkdIyG6XsZH-am?usp=sharing

Informe o contexto do seu projeto para o agente.

Passo 3: O Refinamento (Mão na Massa)

Você deve você deve conversar com o agente sobre as funcionalidades necessárias.

O agente deve ajudar a transformar a ideia vaga em uma lista de Requisitos Funcionais e Não Funcionais.

Acesse o repositorio do projeto em seu computador ou através do próprio github

Construa um arquivo com o nome requisitos.md e faça o commit e push para o github

Aula
Traduzindo os Requisitos em Estrutura HTML5
Conteúdo
Nesta fase, vamos procurar traduzir os requisitos do projeto em uma estrutura Semântica do HTML5.

O conteúdo foca em:

A Estrutura do Documento: Compreender o papel do <!DOCTYPE html>, <html>, <head> (metadados) e <body>.

Seções de Documento: Diferenciar o uso de <header>, <nav>, <main>, <section>, <article>, <aside> e <footer> conforme a hierarquia de informação.

Tags de Conteúdo e Formulários: Organizar títulos (<h1> a <h6>), parágrafos, listas e preparar os campos de entrada de dados para o projeto.

Objetivos de Aprendizagem
Espera-se que ao final desta atividade, o aluno seja capaz de:

Mapear Requisitos em Tags: Traduzir uma lista de funcionalidades (ex: "Área de Login") em elementos HTML corretos (ex: <form>, <input>, <label>).

Construir Semântica Pura: Estruturar o projeto autoral utilizando tags HTML5 que descrevam o significado do conteúdo, facilitando o SEO e a acessibilidade.

Utilizar IA de Forma Consultiva: Demonstrar habilidade em usar o Agente Gemini para validar escolhas técnicas e resolver dúvidas de marcação sem depender de copy-paste.

Preparar o Terreno para CSS/JS: Criar um HTML limpo, com IDs e Classes estratégicas que facilitem a futura estilização e comportamento.
Atividades
1. Acessar o Agente Especialista em HTML5
Acesse o https://gemini.google.com/gem/1yxVdoRwvIB0mb4A1OJIXfVMZz0e4aG6U?usp=sharing e apresente seu projeto.

Exemplo de comando: "Olá, sou aluno de desenvolvimento web. Meu projeto autoral está anexado. Me ajude a elaborar estrutura HTML, do meu projeto

2. Mapeamento e Estruturação Manual
Abra seu editor de código (VS Code) e comece a escrever o arquivo index.html.

Consulte o agente sobre cada seção do seu projeto.

Desafio: Se o agente sugerir uma tag, pergunte: "Por que usar <article> aqui em vez de <section>?"

3. Implementação de Requisitos Funcionais
Transforme seus requisitos em elementos de interface:

Crie os menus de navegação dentro da tag <nav>.

Estruture formulários de contato ou busca, focando nos novos tipos de input do HTML5.

Organize o conteúdo principal dentro de <main>.

4. Validação e Entrega
Checklist de Qualidade: Verifique se não existem <div> onde poderia haver uma tag semântica.

Versionamento: Realize o git add, git commit e git push do seu progresso para o repositório criado na Atividade 001.

Registro: No arquivo README.md, Atualize sobre o seu projeto.
Aula
Teoria sobre HTML
Conteúdo
A aula cobrirá os conceitos fundamentais para a construção de páginas web, partindo da teoria até a execução

Fundamentos da Web: A diferença entre linguagem de marcação e programação, e como funciona a "Tríade da Web" (HTML, CSS e JavaScript)

Anatomia do HTML: Como funcionam as tags (abertura, conteúdo e fechamento), uso de atributos (como href em links), aninhamento (tags dentro de tags) e tags singulares sem fechamento (como a tag img)

Estrutura Obrigatória: A base de qualquer site moderno (declaração <!DOCTYPE html>, <html>, <head> e <body>)

Principais Elementos de Marcação: Criação de títulos da página (h1 a h6), parágrafos (p), formatação de texto (strong e em), links e listas (ordenadas e não ordenadas) .

Estilização Visual: Introdução aos primeiros comandos de CSS para aplicar cores, ajustar fontes e centralizar o layout da página construída .

Objetivos de Aprendizagem
Ao final desta aula, espera-se que os alunos sejam capazes de:

Compreender o papel do HTML como o "esqueleto" estrutural de um site e do CSS como a camada de design visual

Configurar e operar um ambiente de desenvolvimento profissional (VS Code) de forma independente .

Estruturar semanticamente uma página web utilizando a hierarquia correta de títulos e organizando o conteúdo em blocos estruturais (como divisões de layout usando div ou seções similares) .

Aplicar uma folha de estilos básica para dar vida e formatação ao documento de texto cru .
Atividades
Instruções Passo a Passo:

Acessem o Material de Apoio: Abram e assistam ao vídeo "Curso de HTML para iniciantes - Aprenda HTML em 1 hora" do canal Hora de Codar, disponível neste link: https://www.youtube.com/watch?v=SV7TL0hxmIQ.

Revisão do Conteúdo: Utilizem o vídeo para relembrar os conceitos que discutimos em aula. Prestem atenção especial na parte teórica sobre o que é HTML, na anatomia das tags (abertura, conteúdo e fechamento) e na estrutura inicial obrigatória de um documento (<!DOCTYPE html>, <html>, <head>, <body>).

Criação do Resumo em Markdown: No computador de vocês, criem um arquivo com a extensão Markdown (por exemplo, resumo_html.md. Neste arquivo, descrevam com as próprias palavras o que vocês aprenderam. O arquivo deve conter obrigatoriamente:

Uma breve explicação sobre o que é o HTML (lembrando que é uma linguagem de marcação e não de programação).

Um glossário/lista explicando para que servem as principais tags que vimos (<h1> a <h6>, <p>, <a>, <img>, etc.).

Como a tag div ajuda no aninhamento e organização do código.

Envio para o GitHub: Após finalizarem o texto e salvarem o arquivo Markdown, façam o commit e o push desse arquivo para o repositório de vocês no GitHub e finalizem a lição no LabSIS.

Aula
Criação de Formulários Avançados
Conteúdo
Nesta lição, iremos sair do básico "texto e botão" para explorar uma gama maior de captura de dados permitida pelo HTML:

A Base do Formulário: A tag <form> e seus atributos vitais de envio (como action e method).

Acessibilidade e Usabilidade: A importância da tag <label> e a correlação do atributo for com o id do input para melhorar a experiência do usuário.

Tipos de Entradas Específicas (Inputs): Como utilizar input type para diferentes cenários, incluindo password (senhas ocultas), date (calendário nativo), file (upload de arquivos), radio (escolha única) e checkbox (múltiplas escolhas).

Listas Suspensas e Áreas de Texto: A criação de menus de seleção com as tags <select> e <option>, e a captura de textos longos utilizando a tag <textarea>.

Agrupamento Semântico: Como organizar formulários muito grandes em blocos lógicos usando as tags <fieldset> (para criar a caixa de agrupamento) e <legend> (para dar um título ao grupo).

Objetivos de Aprendizagem
Ao final desta lição, os alunos deverão ser capazes de:

Compreender os diferentes métodos de entrada de dados no HTML e quando usar cada um de forma apropriada.

Estruturar um formulário complexo mantendo a acessibilidade, garantindo que todo campo tenha um rótulo (label) corretamente associado.

Dividir formulários extensos em seções semânticas que façam sentido visual e estruturalmente para o usuário final.

Atividades
Vocês foram contratados para criar a página de inscrição de um evento fictício chamado "1º Hackathon de Informática da Escola". O formulário deve coletar uma série de informações variadas dos participantes.

Instruções da Atividade:

Criação do Arquivo: Crie um novo arquivo chamado inscricao.html. Não é necessário focar no CSS agora, o objetivo é 100% a estrutura do HTML.

Estruturação do Formulário: O formulário deverá ser dividido em três blocos organizados utilizando as tags <fieldset> e <legend> para cada bloco.

Bloco 1: Dados Pessoais:

Deve conter campos para Nome Completo (text), E-mail (email), Senha para o sistema (password) e Data de Nascimento (date).

Bloco 2: Perfil Técnico:

Um campo de múltipla escolha (checkbox) perguntando quais linguagens o aluno tem interesse (ex: HTML, CSS, JavaScript, Python).

Um campo de escolha única (radio) perguntando o nível de experiência (Iniciante, Intermediário, Avançado).

Um campo de upload de arquivo (file) solicitando que o aluno anexe um currículo ou portfólio.

Bloco 3: Detalhes do Evento:

Uma lista suspensa (select e option) para o aluno escolher o tamanho da camiseta do evento (P, M, G, GG).

Uma caixa de texto grande (textarea) solicitando que o aluno escreva uma carta de motivação sobre o porquê deseja participar.

Finalização: Adicione um botão de submissão ao final do formulário (<button type="submit">).

Entrega no GitHub: Façam o commit e o push do arquivo inscricao.html para os seus repositórios no GitHub para avaliação técnica da estrutura das tags.
Aula
Iniciando com CSS
Conteúdo
O que é CSS: Entendendo a diferença prática entre a estrutura/conteúdo (HTML) e a sua representação visual ou estética (CSS).

Sintaxe Básica: Como funcionam os Seletores (como encontrar a tag HTML), as Propriedades (o que você quer mudar) e os Valores (qual será a nova aparência).

Conectando os Arquivos: Como usar a tag <link rel="stylesheet"> dentro da seção <head> do HTML para importar a folha de estilos externa.

Uso de IA como Assistente de Estudo: A importância de fornecer contexto e ser específico ao criar comandos (prompts) para a Inteligência Artificial.

Leitura de Documentação: Introdução ao MDN Web Docs e W3Schools como fontes seguras para validar e entender códigos gerados pela IA.

Objetivos de Aprendizagem
Compreender a relação intrínseca entre o esqueleto HTML e as regras visuais do CSS.

Aprender a buscar soluções de design de forma autônoma, formulando boas perguntas para a IA e consultando a documentação oficial.

Aplicar estilos básicos e estruturais no projeto principal (utilizando propriedades como color, background-color, font-size, text-align e border).
Atividades
Preparação do Ambiente: No VS Code, criem um novo arquivo chamado style.css na mesma pasta do seu projeto. Em seguida, no arquivo .html, conectem os dois usando a tag <link> dentro do <head>.

Consulta com a Inteligência Artificial: Abram uma ferramenta de IA de sua preferência (como ChatGPT, Gemini ou Claude). Escolham uma seção específica do site de vocês (por exemplo, o menu, o rodapé ou a área principal) e peçam para a IA sugerir como estilizá-la. É fundamental fornecer o seu código HTML atual para a IA entender o contexto.

Validação na Documentação: A IA provavelmente vai sugerir algumas propriedades que vocês ainda não conhecem. Peguem pelo menos três dessas propriedades (ex: margin, padding, display) e pesquisem no site MDN Web Docs ou W3Schools para ler a explicação oficial e ver outros exemplos de uso.

Mão na Massa e Versionamento: Apliquem o código CSS que vocês estudaram no arquivo de vocês, salvem, visualizem o resultado no navegador e façam o commit da nova versão estilizada do projeto no GitHub.
Aula
Teoria e Prática de CSS
Conteúdo
A aula cobrirá os conceitos fundamentais para a estilização de páginas web, partindo da teoria até a execução e publicação do projeto online.

Fundamentos do CSS: A diferença entre as três formas de aplicar CSS (Inline, Interno e Externo) e como funciona a hierarquia de especificidade entre elas.

Box Model (Modelo de Caixa): Entendimento prático de margens (margin), preenchimento interno (padding), bordas (border) e conteúdo. A importância de resetar margens padrão e o uso do box-sizing: border-box.

Seletores e Estilização Visual: Como selecionar elementos por tags, classes (.classe) e atributos (ex: input[type="text"]). Aplicação de cores com formato hexadecimal (color, background-color), importação de fontes externas via Google Fonts e ajustes de layout.

Introdução ao Flexbox: Como utilizar display: flex, flex-direction (row e column) e gap para alinhar os elementos estruturais e padronizar os espaçamentos.

Objetivos de Aprendizagem
Ao final desta aula, espera-se que os alunos sejam capazes de:

Compreender o papel do CSS como a camada de design visual e vinculá-lo corretamente ao documento HTML utilizando a tag <link>.

Manipular o Box Model de forma independente para ajustar o tamanho e o espaçamento interno e externo de qualquer elemento na página.

Aplicar uma folha de estilos externa estruturada, utilizando classes para estilizar blocos específicos de conteúdo sem gerar conflitos.
Atividades
Acessem o Material de Apoio: Abram e assistam ao vídeo "Aprenda CSS do ZERO até colocar o SITE NO AR | Tutorial PASSO A PASSO com PROJETO PRÁTICO" do canal Rafaella Ballerini, disponível neste link: https://www.youtube.com/watch?v=AB35iSr1YyA.

Revisão do Conteúdo: Utilizem o vídeo para relembrar os conceitos que discutimos em aula. Prestem atenção especial na parte teórica sobre a diferença entre margin e padding (o Modelo de Caixa), na criação do arquivo externo .css e na forma correta de selecionar elementos usando as "classes" para organização de código.

Criação do Resumo em Markdown: No computador de vocês, criem um arquivo com a extensão Markdown (por exemplo, resumo_css.md). Neste arquivo, descrevam com as próprias palavras o que vocês aprenderam. O arquivo deve conter obrigatoriamente:

Uma breve explicação sobre a utilidade do CSS e por que o uso de um arquivo externo (style.css) é o mais recomendado.

Um glossário/lista explicando para que servem as principais propriedades que vimos (color, background-color, margin, padding, display: flex, etc.).

Uma explicação simples de como o conceito de "classes" ajuda na hora de estilizar elementos específicos.

Envio para o GitHub: Após finalizarem o texto e salvarem o arquivo Markdown, façam o commit e o push desse arquivo para o repositório de vocês no GitHub e finalizem a lição no LabSIS.
Aula
Responsividade: Adaptando Layouts com CSS Media Queries
Conteúdo
O que é Design Responsivo: A importância de criar sites que se adaptam e oferecem uma boa experiência de navegação em qualquer tamanho de tela, sem a necessidade de criar múltiplas versões do mesmo site.

A Tag Meta Viewport: A tag obrigatória (<meta name="viewport" content="width=device-width, initial-scale=1.0">) no HTML que informa aos navegadores móveis para não encolherem a página artificialmente, respeitando as dimensões reais do dispositivo.

Sintaxe Básica das Media Queries: Como utilizar a regra @media no CSS para aplicar estilos condicionais. Entendendo a diferença e a aplicação prática de min-width (largura mínima) e max-width (largura máxima).

Os Três Breakpoints (Pontos de Quebra): Como definir as larguras de tela para separar o layout em Mobile (celulares), Tablet e Desktop (computadores). Introdução rápida ao conceito de Mobile-First (começar o estilo do menor para o maior).

Uso de IA para Refatoração de Layout: Como explicar para a Inteligência Artificial o comportamento atual do layout e pedir sugestões de como reorganizar elementos (ex: transformar colunas em linhas) para telas menores.

Leitura de Documentação e Ferramentas: Como utilizar o "Inspecionar Elemento" (DevTools) do navegador para simular telas de celulares e consultar o MDN Web Docs sobre regras de @media.

Objetivos de Aprendizagem
Compreender o conceito de responsividade e a função vital da tag <meta viewport> no HTML.

Escrever e organizar regras de Media Queries no arquivo CSS para adaptar o design autoral em três dimensões: mobile, tablet e desktop.

Utilizar as ferramentas de desenvolvedor do navegador para simular dispositivos e testar as quebras de layout em tempo real.

Formular prompts claros para a IA ajudá-los a resolver problemas de quebra de layout, validando as soluções sugeridas na documentação oficial.
Atividades
Preparação do Ambiente e Simulação: Abram o projeto autoral no VS Code e certifiquem-se de que a tag <meta name="viewport"...> está dentro do <head> do HTML. No navegador, abram o projeto, cliquem com o botão direito, selecionem "Inspecionar" e ativem a "Barra de ferramentas de dispositivo" (ícone de celular/tablet) para simular diferentes telas.

Consulta com a Inteligência Artificial: Escolham uma parte do site de vocês que fica "quebrada" ou espremida na tela do celular (como um menu lateral ou imagens grandes). Copiem o HTML e o CSS dessa seção, colem na sua IA de preferência e perguntem: "Este é o meu código atual. Como posso usar CSS Media Queries para fazer essa seção se adaptar para telas de celular (até 768px), tablet e desktop?".

Validação na Documentação: A IA provavelmente utilizará regras como @media screen and (max-width: 768px) ou abordagens com Flexbox/Grid. Acessem o MDN Web Docs e pesquisem por "CSS Media Queries" para entender exatamente como os limites de tela (min-width e max-width) funcionam antes de copiar o código.

Mão na Massa e Versionamento: Definam três breakpoints no final do arquivo style.css de vocês (um para mobile, um para tablet e um padrão para desktop). Apliquem as mudanças de tamanho de fonte, margens e disposição de elementos para cada tela. Testem tudo no navegador simulando os dispositivos e, por fim, façam o commit da versão responsiva do projeto no GitHub.
Aula
Introdução ao JavaScript
Conteúdo
O que é JavaScript (JS): A analogia do corpo humano (HTML é o esqueleto, CSS é a pele e as roupas, JS são os músculos e o sistema nervoso). O JS é o que permite que a página reaja às ações do usuário.

O DOM (Document Object Model): Entendendo de forma simplificada como o JavaScript enxerga o HTML como uma árvore de elementos que podem ser selecionados, modificados ou ocultados.

Sintaxe Básica e Conexão: Como criar um arquivo .js e conectá-lo ao HTML utilizando a tag <script src="script.js"></script> (e por que geralmente a colocamos logo antes de fechar a tag </body>).

Lógica Orientada a Eventos: O conceito básico de "escutar" uma ação (como um clique de mouse ou a rolagem da página) para disparar uma função.

A IA como Arquiteta de Soluções: Como conversar com a Inteligência Artificial não apenas para pedir código, mas para pedir ideias do que pode ser feito no projeto e como traduzir uma intenção humana em lógica de máquina.

O Console do Navegador (Debugging básico): Como usar o console.log() e o painel de desenvolvedor do navegador (F12) para conversar com o seu código e descobrir onde estão os erros.

Objetivos de Aprendizagem
Compreender o papel do JavaScript no desenvolvimento Front-end e como ele interage com o HTML/CSS.

Aprender a estruturar e vincular corretamente arquivos de scripts no projeto.

Desenvolver a habilidade de explicar uma regra de negócio ou interação desejada para a IA, utilizando-a como mentora para escrever as funções JavaScript.

Aplicar, testar e debugar pelo menos um recurso interativo no projeto autoral (ex: um botão de modo claro/escuro, um menu hambúrguer para a versão mobile, ou um alerta de boas-vindas).
Atividades
Preparação do Ambiente: No VS Code, criem um arquivo chamado script.js. No index.html, insiram a tag <script> no local correto para importar o arquivo. Dentro do JS, escrevam console.log("O JavaScript está funcionando!");. Abram a página, inspecionem, vão até a aba "Console" e confirmem se a mensagem apareceu.

Sessão de Brainstorming com a IA: Abram a IA de sua escolha e ajam como se ela fosse o gerente de produto de vocês. Enviem o seguinte comando (adaptando para o projeto): "Meu projeto é sobre [Tema do Projeto]. Eu tenho o HTML e CSS básicos prontos. Atue como um professor e me sugira 3 ideias simples de interatividade com JavaScript que eu poderia adicionar para deixar meu site mais legal para o usuário. Não me dê o código ainda, apenas as ideias."

Construção Guiada do Código: Escolham uma das ideias da IA (ex: criar um menu mobile que abre e fecha). Agora, forneçam o HTML da seção correspondente para a IA e digam: "Gostei da ideia do menu. Aqui está o meu HTML e CSS do menu. Como eu escrevo o JavaScript para fazer o botão de abrir/fechar funcionar? Por favor, explique o código passo a passo e me diga se preciso adicionar algum 'id' ou 'class' no meu HTML."

Validação, Mão na Massa e Versionamento: Leiam a explicação da IA. Se ela usou métodos como document.getElementById ou addEventListener, pesquisem esses termos no MDN Web Docs para entender a documentação oficial. Colem o código no projeto, testem no navegador e corrijam eventuais erros usando o Console. Quando estiver funcionando, façam o commit da nova versão iterativa no GitHub.
Aula
Imersão em JavaScript: Fundamentos e Manipulação do DOM
Conteúdo
Conteúdo
Variáveis e Boas Práticas: A diferença entre var, let e const. Por que a programação moderna prioriza o uso de const (para valores fixos) e let (para variáveis que vão mudar).

Tipos de Dados: Entendendo como o JavaScript lida com Textos (Strings), Números (Numbers), Booleanos (Verdadeiro/Falso), Listas (Arrays) e Objetos.

Métodos e Estruturas de Repetição: Como automatizar tarefas repetitivas usando loops (while, for) e métodos modernos de listas (forEach, map, filter).

Funções e Arrow Functions: O que são blocos de código reaproveitáveis e como escrevê-los da forma tradicional ou usando a sintaxe moderna e enxuta das Arrow Functions.

O DOM (Document Object Model): A ponte entre a lógica e a parte visual. Como o JavaScript enxerga as tags HTML da página.

Seleção e Manipulação de Elementos: Como encontrar elementos específicos usando o poderoso querySelector e alterar seus estilos, classes ou textos diretamente pelo JS.

Eventos: Como "escutar" ações do usuário (como o clique de um botão) usando o addEventListener para disparar mudanças visuais ou lógicas.

Objetivos de Aprendizagem
Consolidar os fundamentos da linguagem JavaScript, compreendendo como armazenar dados e criar funções.

Dominar a seleção de elementos HTML utilizando o querySelector.

Compreender o fluxo de Interação -> Evento -> Manipulação do DOM para criar páginas dinâmicas.

Utilizar a IA como parceira de revisão de código, garantindo que as lógicas e seletores do projeto autoral estejam sendo aplicados corretamente.
Atividades
URL de referência para a aula: https://www.youtube.com/watch?v=hyMCPZNLXps

Estudo Dirigido com o Vídeo: Assistam aos módulos do vídeo referentes a Variáveis, Tipos de Dados e O DOM. À medida que o instrutor digita, abram o arquivo script.js de vocês (ou o Console do navegador) e tentem reproduzir o comportamento usando os próprios textos e ideias.

Mapeamento de Interações no Projeto Autoral: Olhem para o projeto de vocês e pensem em pelo menos dois elementos que deveriam reagir à ação do usuário (ex: um botão de "Saiba Mais" que revela um parágrafo escondido, ou uma imagem que muda ao passar o mouse).

Programação em Par com a Inteligência Artificial: Usem a IA como mentora para estruturar a lógica. Enviem o HTML da seção escolhida e um prompt como:

"Estou estudando manipulação do DOM e eventos em JavaScript. Quero que, ao clicar no botão X, o texto Y mude de cor e apareça na tela. Baseado no meu HTML abaixo, me mostre como eu seleciono esses elementos usando querySelector e como crio o addEventListener. Quero que você comente o código passo a passo para eu entender."

Mão na Massa e Versionamento: Levem o código gerado ou refinado pela IA para o projeto autoral. Testem exaustivamente no navegador. Lembrem-se da dica do vídeo: deixem a aba "Console" (Inspecionar Elemento) sempre aberta para ver se a interação está gerando algum erro vermelho. Quando tudo estiver funcionando de forma interativa, façam o commit e subam as alterações para o GitHub.
Aula
Seminário de Projetos Autorais – Mostra de Aplicações
Conteúdo
A aula será dedicada à apresentação e avaliação técnica dos projetos autorais em formato de seminário, focando na comunicação assertiva de produtos de software e na demonstração prática de código em funcionamento.

Estruturação de Produto de Software: Como sintetizar o escopo de um projeto, definindo com clareza a dor (problema real), a solução proposta e os objetivos principais da aplicação.

Arquitetura e Stack Tecnológica: Apresentação justificada das tecnologias escolhidas pela equipe (linguagens, frameworks, banco de dados e infraestrutura) e como elas atendem aos requisitos do projeto.

Demonstração Prática (Live Demo): Execução do software em tempo real, navegando pelo fluxo principal de uso para validar a interface e as funcionalidades já concluídas (status atual).

Visão de Futuro e Roadmap: Exposição transparente das etapas de desenvolvimento que ainda faltam, detalhando os próximos passos e a viabilidade de expansão do projeto (como a implementação de novas funcionalidades ou evolução para um modelo SaaS).

Análise Crítica e Resolução de Problemas: Discussão sobre os maiores desafios técnicos enfrentados durante a codificação ou modelagem de dados, as soluções adotadas para contorná-los e as lições aprendidas ao longo do processo.

Objetivos de Aprendizagem
Desenvolver a capacidade de comunicação técnica e argumentação dos alunos.

Avaliar a viabilidade, o progresso técnico e o planejamento dos projetos em desenvolvimento.

Proporcionar um ambiente de troca, onde os alunos aprendem com as soluções e desafios dos colegas.
Atividades
Tempo Sugerido: 10 a 15 minutos de apresentação por equipe + 5 minutos para perguntas e feedback da turma/professor.

Formato: Apresentação de slides (máximo de 10) mesclada com a demonstração ao vivo da aplicação (Live Demo).

Regra de Ouro: A demonstração prática deve ser o centro da apresentação. Os slides servem apenas como apoio visual e narrativo.


Estrutura Exigida para a Apresentação (Máximo de 10 Slides)

Os alunos deverão seguir este roteiro para garantir que cobrirão todos os pontos exigidos sem se estenderem em teorias desnecessárias:

Slide 1: Capa e Identidade:

Nome do projeto, logotipo (se houver) e nome dos integrantes da equipe.

Uma frase de impacto que resuma o que o sistema faz (ex: "Um sistema de gestão web para otimizar a organização de eventos e voluntários").

Slide 2: O Problema

Qual é a dor ou a necessidade do mundo real que a aplicação se propõe a resolver? Quem é o usuário alvo?

Slide 3: A Solução e Objetivos

Como o software resolve o problema apresentado. Quais são os objetivos principais do projeto (reduzir tempo, prever resultados, facilitar acessos, etc.).

Slide 4: A Arquitetura e Stack Tecnológica

Uma visão rápida das tecnologias escolhidas (linguagens, frameworks, banco de dados, infraestrutura) e por que foram escolhidas para este escopo.

Slide 5: O Palco (Transição para a Demonstração)

Este slide marca a pausa na apresentação teórica para a Live Demo.

Os alunos devem abrir a aplicação rodando (preferencialmente já hospedada/em deploy) e mostrar o fluxo principal de uso. Se algo quebrar ao vivo, devem explicar o erro tecnicamente.

Slide 6: Status Atual (Até onde chegamos)

Um resumo transparente do que já está 100% funcional.

Quais módulos ou features foram entregues e validados até o momento.

Slide 7: Maiores Desafios Técnicos

O que foi mais difícil de implementar até agora? Como a equipe contornou problemas de código, arquitetura ou regra de negócio?

Slide 8: O Roadmap (Aonde pretendemos chegar)

O planejamento para o futuro do projeto. Quais funcionalidades ainda faltam? Há planos para transformar em um SaaS, criar um aplicativo mobile ou integrar alguma IA?

Slide 9: Lições Aprendidas

Uma reflexão rápida sobre o que fariam de diferente se começassem o projeto hoje (mudariam a stack? Planejariam melhor o banco de dados?).


Slide 10: Perguntas e Encerramento

Agradecimento, contatos (links para o repositório no GitHub ou LinkedIn dos alunos) e abertura para a sabatina da turma e do professor.
Aula
Checkpoint Técnico
Conteúdo
A aula será dedicada ao acompanhamento técnico individualizado (checkpoint) das equipes no laboratório, focando na resolução de bloqueios, revisão de código e alinhamento do escopo dos projetos autorais.

Revisão de Arquitetura e Código (Code Review): Análise da estrutura atual do projeto, qualidade do código escrito até o momento, organização de pastas e uso adequado de padrões ou frameworks.

Resolução de Bloqueios (Debugging): Identificação e correção guiada de erros complexos, falhas de integração ou problemas de modelagem no banco de dados que estão impedindo o avanço da equipe.

Validação de Regras de Negócio: Avaliação de como as funcionalidades implementadas até agora estão resolvendo o problema real proposto no escopo inicial do software.

Alinhamento de Escopo e Prazos: Readequação do roadmap do projeto (se necessário), cortando features não essenciais para garantir a entrega de um Produto Mínimo Viável (MVP) funcional até a data final.

Objetivos de Aprendizagem
Ao final desta aula, espera-se que os alunos sejam capazes de:

Diagnosticar e explicar tecnicamente os bugs e gargalos de desenvolvimento que estão enfrentando em suas aplicações.

Aplicar as refatorações de código e correções de arquitetura sugeridas pelo professor durante a mentoria.

Priorizar as tarefas de desenvolvimento, separando o que é requisito obrigatório para o funcionamento do sistema do que é apenas "perfumaria" visual ou funcional.

Operar de forma colaborativa no ambiente de laboratório, utilizando o controle de versão (Git) para registrar os avanços feitos na aula.
Atividades
Instruções Passo a Passo:

Preparação do Ambiente: Assim que chegarem ao laboratório, liguem as máquinas, façam o git pull da versão mais recente do repositório da equipe, iniciem o servidor local e garantam que o banco de dados está rodando. O projeto deve estar pronto para ser executado e inspecionado.

Mapeamento de Dúvidas (A Pauta): Antes de chamarem o professor, a equipe deve listar em um arquivo de texto os 3 principais problemas ou bloqueios técnicos que estão enfrentando no momento (ex: "Erro na autenticação de usuários", "Dificuldade em relacionar as tabelas X e Y", "Problema no deploy").

O Checkpoint (Mentoria com o Professor): Apresentem a aplicação rodando. Mostrem o que já está funcionando e, em seguida, demonstrem os erros ou dúvidas mapeados no passo anterior. Estejam com o editor de código aberto na tela para revisão e pair programming (programação em pares) com o professor.

Plano de Ação e Commit: Após o feedback do professor, documentem o que foi decidido e apliquem as correções imediatamente. Ao final da aula, façam o commit e o push de tudo o que foi refatorado ou adicionado ao longo do laboratório para o repositório no GitHub, e finalizem a presença/lição no LabSIS.
Aula
Armazenamento Assíncrono com IndexedDB
Conteúdo
O que é IndexedDB: Entendendo o banco de dados nativo do navegador para armazenar informações estruturadas (como objetos e listas) de forma permanente no lado do cliente.

Arquitetura de Projeto e Separação de Responsabilidades: A importância de dividir a aplicação em camadas: index.html (interface e formulários), controller.js (lógica de interação, receber dados da tela e atualizar o HTML) e db.js (exclusivo para comunicação com o banco de dados).

Uso de IA para Infraestrutura: Como solicitar à Inteligência Artificial a criação de um "mini framework" para simplificar o uso do IndexedDB (escondendo a complexidade de eventos e callbacks nativos através de funções e Promises).

Teste Local e Escopo Global: Como conectar múltiplos arquivos JavaScript diretamente no HTML de forma sequencial para testar o projeto localmente (sem o uso de servidores como o Live Server), entendendo como o controller.js enxergará as funções do db.js.

Objetivos de Aprendizagem
Compreender a função do IndexedDB e como ele permite salvar os dados do projeto autoral diretamente no navegador do usuário.

Aplicar o conceito de modularização visual e lógica, separando regras de negócio e manipulação de tela (controller.js) da persistência de dados (db.js).

Praticar a engenharia de prompt para gerar scripts complexos de banco de dados com a IA, orientando-a sobre restrições técnicas (como a ausência de um servidor local).

Desenvolver a autonomia para debugar aplicações inspecionando o "Console" e a aba "Application" do navegador.
Atividades
Preparação do Ambiente e Conexão Local: No VS Code, criem os arquivos db.js e controller.js na mesma pasta do projeto autoral. No arquivo index.html, conectem os dois arquivos inserindo <script src="db.js"></script> e logo abaixo <script src="controller.js"></script> (antes de fechar o </body>). Como vamos testar localmente sem Live Server, não usem o atributo type="module", apenas a importação simples. A ordem importa: o banco carrega primeiro, o controlador depois.

Construção do Mini Framework com a IA: Abram a ferramenta de IA da preferência de vocês e enviem o seguinte prompt: "Atue como um desenvolvedor Sênior. Quero que você crie um arquivo db.js que funcione como um mini framework para o IndexedDB usando Promises e async/await. Crie as funções: iniciar banco, adicionar item, buscar itens e deletar item. Como vou rodar o arquivo localmente sem servidor (sem Live Server), não utilize export ou import (para evitar erro de CORS). Apenas crie as funções para que fiquem disponíveis globalmente. Explique o que cada uma faz".

Adaptação para o Projeto Autoral: No arquivo controller.js, criem a ponte entre o HTML e o Banco. Façam um evento que "escuta" o envio do formulário do projeto de vocês, captura os dados (ex: nome, data, categoria), monta um objeto e envia para a função de salvar que está no db.js. Ao final, mandem listar os dados salvos na tela.

Mão na Massa e Versionamento: Levem o código gerado ou refinado pela IA para o projeto autoral. Testem exaustivamente de forma local abrindo o arquivo index.html diretamente no navegador (com duplo clique). Lembrem-se da dica do vídeo: deixem a aba "Console" (Inspecionar Elemento) sempre aberta para ver se a interação está gerando algum erro vermelho. Usem também a aba "Application" (ou Aplicativo) -> IndexedDB para ver se as tabelas e dados estão sendo criados. Quando tudo estiver funcionando de forma interativa, façam o commit e subam as alterações para o GitHub.
Aula
UI/UX do Caos: A Pior Seleção de Data de Nascimento com IndexedDB
Conteúdo
Anti-Padrões de UI/UX: O que torna uma interface terrível? Estudo prático de usabilidade criando propositalmente o cenário oposto ao ideal para entender a importância da acessibilidade e experiência do usuário.

Manipulação Avançada do DOM (Document Object Model): Uso intensivo de HTML e JavaScript para criar comportamentos não convencionais (ex: botões que fogem do mouse, sliders imprecisos, inputs que apagam sozinhos).

Gestão de Eventos no JavaScript: Aprofundamento em Event Listeners (mouseover, click, input, drag) para controlar o caos criado na interface.

Persistência de Dados (IndexedDB): Como capturar o dado final (a data de nascimento, por mais difícil que tenha sido gerá-la) e salvá-la de forma estruturada e assíncrona no banco de dados do navegador.

Objetivos de Aprendizagem
Exercitar a lógica de programação e a manipulação avançada de elementos HTML e CSS através do JavaScript.

Compreender na prática o valor de uma boa Experiência do Usuário (UX), sentindo a frustração de operar uma interface mal desenhada.

Consolidar o uso do IndexedDB, garantindo que mesmo os dados gerados pelas interfaces mais caóticas sejam validados e salvos corretamente no banco de dados local.

Garantir a Ética no Desenvolvimento: Aprender a ter liberdade criativa total dentro de limites profissionais e éticos (reforçando a proibição estrita de conteúdos ilegais, ofensivos, preconceituosos ou de cunho sexual).
Atividades
Passo 1: O Brainstorming do Caos: Em seus projetos, planejem qual será a "pior maneira de inserir uma data de nascimento". Regra de ouro: A criatividade é livre, desde que o conteúdo seja 100% apropriado (nada ilegal ou sexual). Exemplos para inspirar:

Um botão que o usuário precisa clicar 2.000 vezes para chegar ao ano 2000.

Um slider (barra deslizante) que vai de 1 a 31, mas os números estão invisíveis.

Um campo de texto onde as teclas do teclado digitam números aleatórios e o usuário tem que contar com a sorte.

Passo 2: Construção da Interface (HTML/CSS/JS): No arquivo index.html e style.css de seus projetos autorais, construam essa interface terrível. No controller.js, programem os eventos loucos usando JavaScript. O objetivo aqui é praticar muita lógica! Usem a IA para ajudar a criar funções mirabolantes (ex: "IA, como faço um botão mudar de posição na tela toda vez que o mouse passar por cima dele?").

Atividade 3: A Recompensa (Salvando no IndexedDB): Depois que o usuário "sofrer" para conseguir colocar a data correta na tela, criem um botão "Salvar Data". Esse botão deve capturar o valor final, montar o objeto e chamar a função de adicionar ao banco do arquivo db.js (o mini-framework que criamos na aula anterior).

Atividade 4: Mão na Massa e Versionamento: Levem o código gerado ou refinado pela IA para o projeto autoral. Testem exaustivamente no navegador abrindo o arquivo index.html diretamente de forma local (sem utilizar o Live Server, para que as funções globais do db.js e controller.js se comuniquem corretamente sem erros de CORS). Lembrem-se da dica do vídeo: deixem a aba "Console" (Inspecionar Elemento) sempre aberta para ver se a interação está gerando algum erro vermelho. Verifiquem também a aba "Application > IndexedDB" para ter certeza de que a data foi salva com sucesso. Quando tudo estiver funcionando de forma interativa, façam o commit e subam as alterações para o GitHub.
