# Feature Specification: Educational Games PWA

**Feature Branch**: `001-educational-games-pwa`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "PWA mobile-first offline com jogos educativos infantis (até 10 anos): Caça-palavras, Cruzadinha, Jogo de Emoji, com arquitetura extensível para novos jogos, gamificação simples e score por jogo."

## Clarifications

### Session 2026-05-31

- Q: Como o sistema deve tratar acentuação na entrada de texto (Cruzadinha, Adivinhe o Emoji)? → A: Normalizar — aceitar entrada sem acentos como equivalente (ex: "macã" = "maçã"). Acentuação não é exigida.
- Q: Quantos itens devem compor uma rodada/partida em cada jogo? → A: Rodadas curtas por padrão (5-8 itens), com possibilidade de ajuste futuro por nível de dificuldade.
- Q: Qual critério define a classificação de estrelas (1-3) ao final de cada partida? → A: Percentual de acerto — ★ = completou ≥50%, ★★ = ≥75%, ★★★ = 100% dos itens.
- Q: O sistema deve oferecer diferenciação de dificuldade nos jogos? → A: Seleção explícita — a tela inicial de cada jogo oferece "Fácil / Médio / Difícil" para a criança ou responsável escolher.
- Q: Como a pontuação numérica é calculada por partida? → A: Pontos fixos por acerto — cada item correto vale uma quantidade fixa de pontos. Score = total de acertos × pontos por item. Sem bônus de tempo ou multiplicadores.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Tela Inicial e Navegação entre Jogos (Priority: P1)

A criança abre o aplicativo e vê uma tela inicial colorida e amigável com os jogos disponíveis representados por ícones grandes e ilustrativos. Ela toca em um dos jogos para começar a jogar. Após terminar ou desistir, ela retorna facilmente à tela inicial para escolher outro jogo.

**Why this priority**: Sem a navegação central, nenhum jogo é acessível. Esta é a fundação sobre a qual todos os jogos são construídos e a primeira impressão da criança com o app.

**Independent Test**: Pode ser testado abrindo o app e verificando que a tela inicial carrega, exibe os jogos disponíveis com ícones tocáveis, e que tocar em um jogo leva à tela do jogo (mesmo que seja um placeholder). O botão de voltar retorna à tela inicial.

**Acceptance Scenarios**:

1. **Given** o app está instalado e é aberto pela primeira vez, **When** a tela inicial carrega, **Then** todos os jogos disponíveis são exibidos como cards/ícones grandes com nome e ilustração.
2. **Given** a criança está na tela inicial, **When** ela toca em um jogo, **Then** a tela do jogo selecionado é exibida com uma transição animada suave.
3. **Given** a criança está dentro de um jogo, **When** ela toca no botão de voltar, **Then** ela retorna à tela inicial sem perder o estado do jogo em andamento.
4. **Given** um novo jogo é adicionado ao app, **When** a tela inicial carrega, **Then** o novo jogo aparece automaticamente no catálogo sem alterar o layout dos jogos existentes.

---

### User Story 2 — Jogar Caça-Palavras (Priority: P2)

A criança seleciona o jogo Caça-Palavras na tela inicial. Uma grade de letras é apresentada com uma lista de palavras para encontrar. A criança desliza o dedo sobre as letras para marcar uma palavra. Quando encontra uma palavra correta, ela é destacada visualmente com uma animação de celebração. Ao encontrar todas as palavras, a criança vê sua pontuação e uma mensagem de parabéns.

**Why this priority**: Caça-Palavras é o jogo mais reconhecível e simples de interação para crianças. Serve como prova de conceito da arquitetura de jogos plugáveis e do sistema de pontuação.

**Independent Test**: Pode ser testado abrindo o Caça-Palavras, verificando que a grade é gerada com palavras adequadas à faixa etária, que o gesto de deslizar marca palavras, que palavras corretas são destacadas, e que ao completar o jogo a pontuação é exibida e salva.

**Acceptance Scenarios**:

1. **Given** a criança selecionou Caça-Palavras, **When** o jogo carrega, **Then** uma grade de letras é exibida junto com a lista de palavras a encontrar, todas apropriadas para crianças de até 10 anos.
2. **Given** a grade está visível, **When** a criança desliza o dedo sobre uma sequência de letras que forma uma palavra da lista, **Then** a palavra é marcada como encontrada com destaque visual e uma animação breve de celebração.
3. **Given** a criança desliza sobre letras que não formam nenhuma palavra da lista, **When** ela solta o dedo, **Then** a seleção é desfeita sem feedback negativo (sem sons de erro ou mensagens desanimadoras).
4. **Given** todas as palavras foram encontradas, **When** o jogo termina, **Then** a pontuação é calculada, exibida com animação de vitória, e salva no histórico do jogo.
5. **Given** a criança já completou uma partida, **When** ela inicia uma nova partida, **Then** uma nova grade é gerada com palavras diferentes (quando possível).

---

### User Story 3 — Jogar Cruzadinha (Priority: P3)

A criança seleciona o jogo Cruzadinha na tela inicial. Um tabuleiro de palavras cruzadas é apresentado com dicas simples e visuais. A criança toca em uma célula para selecioná-la e digita letras usando um teclado simplificado. Quando completa uma palavra, recebe feedback visual positivo. Ao completar toda a cruzadinha, vê sua pontuação.

**Why this priority**: A Cruzadinha complementa o Caça-Palavras como segundo jogo de vocabulário, validando a extensibilidade da arquitetura de jogos. Exige interação por digitação (diferente do deslizar), testando a versatilidade do design system.

**Independent Test**: Pode ser testado abrindo a Cruzadinha, verificando que o tabuleiro é exibido com dicas, que letras podem ser digitadas nas células, que palavras corretas são confirmadas, e que a pontuação final é calculada e salva.

**Acceptance Scenarios**:

1. **Given** a criança selecionou Cruzadinha, **When** o jogo carrega, **Then** um tabuleiro de palavras cruzadas é exibido com dicas escritas em linguagem simples, adequadas para crianças de até 10 anos.
2. **Given** o tabuleiro está visível, **When** a criança toca em uma célula, **Then** a célula é selecionada com destaque visual e um teclado com letras grandes é exibido para entrada de texto.
3. **Given** uma célula está selecionada, **When** a criança digita a letra correta, **Then** a letra aparece na célula e o foco avança para a próxima célula da palavra.
4. **Given** todas as letras de uma palavra estão corretas, **When** a última letra é inserida, **Then** a palavra é destacada como completa com uma animação breve de celebração.
5. **Given** toda a cruzadinha foi completada, **When** o jogo termina, **Then** a pontuação é calculada, exibida com animação de vitória, e salva no histórico do jogo.

---

### User Story 4 — Jogar Adivinhe o Emoji (Priority: P4)

A criança seleciona o jogo Adivinhe o Emoji na tela inicial. Um emoji grande é exibido no centro da tela. A criança deve digitar o nome do objeto ou ação representado pelo emoji. Se acertar, recebe celebração visual e avança para o próximo emoji. O jogo apresenta emojis em sequência até a criança completar todos os disponíveis na rodada ou decidir parar.

**Why this priority**: Este é o jogo original e diferencial do app. Depende de um dicionário curado de emojis e aceita múltiplas respostas válidas, o que adiciona complexidade de conteúdo. Validar após os dois primeiros jogos garante que a arquitetura já está madura.

**Independent Test**: Pode ser testado abrindo o jogo, verificando que um emoji apropriado é exibido, que o campo de texto aceita entrada, que respostas válidas (incluindo sinônimos do dicionário) são aceitas, e que a pontuação é calculada e salva.

**Acceptance Scenarios**:

1. **Given** a criança selecionou Adivinhe o Emoji, **When** o jogo carrega, **Then** um emoji grande e claro é exibido no centro da tela com um campo de texto para a resposta e um teclado com letras grandes.
2. **Given** um emoji está sendo exibido, **When** a criança digita uma palavra que consta no dicionário de respostas válidas para aquele emoji, **Then** a resposta é aceita com animação de celebração e o próximo emoji é apresentado.
3. **Given** um emoji está sendo exibido, **When** a criança digita uma palavra que não consta no dicionário, **Then** o sistema indica gentilmente que a resposta não é a esperada, sem feedback negativo agressivo, e permite nova tentativa.
4. **Given** um emoji aceita múltiplas palavras válidas (sinônimos), **When** a criança digita qualquer uma delas, **Then** todas são aceitas como corretas.
5. **Given** a criança completou todos os emojis da rodada, **When** o último emoji é respondido, **Then** a pontuação total é exibida com animação de conclusão e salva no histórico do jogo.
6. **Given** a criança deseja parar antes de completar a rodada, **When** ela toca em voltar, **Then** a pontuação parcial é salva e ela retorna à tela inicial.

---

### User Story 5 — Pontuação e Gamificação (Priority: P5)

A criança pode visualizar seus recordes e pontuações em cada jogo. Após cada partida, ela vê estrelas ou ícones de conquista baseados no desempenho. A gamificação é simples — estrelas por partida completada, recorde pessoal por jogo — sem rankings competitivos ou pressão.

**Why this priority**: A gamificação incentiva o replay e o engajamento, mas o app é funcional sem ela. Pode ser adicionada após os três jogos estarem funcionais.

**Independent Test**: Pode ser testado completando partidas em diferentes jogos e verificando que as pontuações são salvas, exibidas corretamente, e que estrelas/conquistas são atribuídas conforme o desempenho.

**Acceptance Scenarios**:

1. **Given** a criança completou uma partida de qualquer jogo, **When** a tela de resultado é exibida, **Then** ela mostra a pontuação da partida, o recorde pessoal naquele jogo, e de 1 a 3 estrelas baseadas no desempenho.
2. **Given** a criança está na tela inicial, **When** ela visualiza o card de um jogo, **Then** o card mostra o recorde pessoal e a melhor classificação de estrelas alcançada.
3. **Given** a criança bateu seu recorde pessoal, **When** a tela de resultado é exibida, **Then** uma animação especial de "novo recorde" é exibida.
4. **Given** nenhuma partida foi jogada ainda em um jogo, **When** a criança vê o card desse jogo, **Then** nenhuma pontuação é exibida e o jogo aparece como "não jogado" de forma convidativa.

---

### User Story 6 — Funcionamento Offline (Priority: P6)

Após o primeiro carregamento, a criança pode abrir o app e jogar qualquer jogo mesmo sem conexão com a internet. Todo o conteúdo dos jogos (palavras, emojis, dicionários) está disponível localmente. As pontuações são salvas localmente no dispositivo.

**Why this priority**: Offline é essencial para o público-alvo (crianças que podem não ter acesso constante à internet), mas requer que os jogos e a infraestrutura já existam para que haja algo para funcionar offline.

**Independent Test**: Pode ser testado instalando o app, desligando a conexão de internet, abrindo o app, e verificando que todos os jogos carregam, são jogáveis, e que pontuações são salvas e recuperadas corretamente.

**Acceptance Scenarios**:

1. **Given** o app foi carregado pelo menos uma vez com internet, **When** o dispositivo perde a conexão, **Then** o app abre normalmente e todos os jogos estão acessíveis.
2. **Given** o app está offline, **When** a criança joga e completa uma partida, **Then** a pontuação é salva localmente e persiste após fechar e reabrir o app.
3. **Given** o app está offline, **When** a criança navega entre jogos e telas, **Then** todas as transições e animações funcionam normalmente sem indicadores de carregamento ou erro.
4. **Given** o app está instalado na tela inicial do dispositivo (PWA), **When** a criança toca no ícone do app, **Then** o app abre em tela cheia como um aplicativo nativo, sem barra de navegação do browser.

---

### Edge Cases

- O que acontece se a criança toca rapidamente em várias letras ao mesmo tempo no Caça-Palavras? O sistema deve processar apenas um gesto de seleção por vez.
- O que acontece se o dispositivo tem uma tela muito pequena? O tabuleiro e as letras devem se adaptar mantendo tamanhos tocáveis mínimos de 44x44px.
- O que acontece se o armazenamento local está cheio? O app deve funcionar normalmente e informar de forma simples que as pontuações não puderam ser salvas.
- O que acontece se a criança digita caracteres especiais ou números no campo de resposta do Emoji? Apenas letras devem ser aceitas; caracteres inválidos são silenciosamente ignorados.
- O que acontece se o dicionário de emojis contém um emoji que não é renderizado no dispositivo? O emoji deve ser validado e, se não renderizar, deve ser excluído da rodada.
- O que acontece se a criança fecha o app no meio de um jogo e reabre? O jogo em andamento deve ser retomado do ponto onde parou.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE ser uma Progressive Web App (PWA) instalável com suporte a service workers para cache completo dos recursos.
- **FR-002**: O sistema DEVE funcionar integralmente offline após o primeiro carregamento, incluindo todos os jogos, conteúdo e persistência de dados.
- **FR-003**: O sistema DEVE apresentar uma tela inicial com catálogo visual de jogos disponíveis, usando ícones grandes e texto legível para crianças.
- **FR-004**: O sistema DEVE suportar uma arquitetura de jogos plugável onde novos jogos podem ser registrados e exibidos automaticamente sem modificar jogos existentes.
- **FR-005**: O sistema DEVE incluir o jogo Caça-Palavras com geração de grades de letras, detecção de gestos de deslizar, e validação de palavras encontradas.
- **FR-006**: O sistema DEVE incluir o jogo Cruzadinha com tabuleiro de palavras cruzadas, dicas em linguagem infantil, e entrada de letras via teclado simplificado.
- **FR-007**: O sistema DEVE incluir o jogo Adivinhe o Emoji com exibição de emojis, campo de entrada de texto, e validação contra um dicionário de respostas válidas por emoji.
- **FR-008**: O sistema DEVE manter um dicionário curado de emojis mapeando cada emoji a uma ou mais palavras válidas, filtrado por adequação à faixa etária (até 10 anos) e possibilidade de descrição com uma única palavra.
- **FR-009**: O sistema DEVE salvar pontuações individualmente por jogo usando armazenamento local no dispositivo.
- **FR-010**: O sistema DEVE exibir feedback visual positivo (animações de celebração) quando a criança acerta ou completa um objetivo.
- **FR-011**: O sistema DEVE evitar feedback negativo punitivo — erros devem ser tratados com neutralidade ou encorajamento gentil.
- **FR-012**: O sistema DEVE exibir uma classificação de 1 a 3 estrelas ao final de cada partida baseada no percentual de acerto: ★ (1 estrela) para ≥50% dos itens corretos, ★★ (2 estrelas) para ≥75%, e ★★★ (3 estrelas) para 100%. Partidas com menos de 50% de acerto não recebem estrelas mas ainda exibem a pontuação de forma encorajadora.
- **FR-013**: O sistema DEVE manter e exibir o recorde pessoal por jogo.
- **FR-014**: O sistema DEVE ser mobile-first com layout responsivo que prioriza telas de smartphones.
- **FR-015**: O sistema DEVE usar tipografia grande e legível, ícones intuitivos, e áreas de toque amplas (mínimo 44x44px) adequadas para crianças.
- **FR-016**: O sistema DEVE persistir o estado de um jogo em andamento para que ele possa ser retomado após fechar e reabrir o app.
- **FR-017**: O sistema DEVE usar apenas conteúdo (palavras, dicas, emojis) adequado para crianças de até 10 anos, em Português Brasileiro.
- **FR-018**: O sistema DEVE restringir a entrada de texto do jogo Adivinhe o Emoji apenas a letras, ignorando caracteres especiais e números.
- **FR-019**: O sistema DEVE gerar partidas variadas, evitando repetições consecutivas de conteúdo quando o acervo de palavras/emojis permitir.
- **FR-020**: O sistema DEVE normalizar acentuação na validação de respostas em todos os jogos com entrada de texto — entrada sem acentos (ex: "macã") DEVE ser aceita como equivalente à forma acentuada correta (ex: "maçã"). A comparação DEVE ser case-insensitive e diacritics-insensitive.
- **FR-021**: Cada jogo DEVE ter rodadas curtas por padrão (5-8 itens por partida), dimensionadas para sessões de 3-5 minutos adequadas à capacidade de atenção do público-alvo. O tamanho da rodada DEVE ser configurável internamente para permitir ajuste futuro por nível de dificuldade.
- **FR-022**: Cada jogo DEVE apresentar uma seleção de nível de dificuldade (Fácil, Médio, Difícil) antes de iniciar a partida. O nível selecionado DEVE influenciar o conteúdo apresentado (tamanho e complexidade das palavras, quantidade de itens na grade/tabuleiro). Os rótulos DEVEM ser visuais e intuitivos (ex: ícones de 1, 2 ou 3 estrelas) para que crianças compreendam sem ler texto. Pontuações e recordes DEVEM ser armazenados separadamente por nível de dificuldade.
- **FR-023**: A pontuação de cada partida DEVE ser calculada por pontos fixos por acerto: cada item correto (palavra encontrada, letra correta, emoji adivinhado) vale uma quantidade fixa de pontos. Score total = número de acertos × pontos por item. Não há bônus de tempo, penalidades por erro, ou multiplicadores.

### Key Entities

- **Game (Jogo)**: Representa um jogo disponível no app. Contém identificador único, nome, ícone/ilustração, descrição breve e referência ao módulo que implementa o jogo. Cada jogo é um módulo independente registrado no catálogo.
- **Game Session (Partida)**: Representa uma instância de jogo em andamento ou concluída. Contém referência ao jogo, estado atual (em andamento, concluída, abandonada), pontuação, classificação de estrelas, e timestamp.
- **Word List (Banco de Palavras)**: Coleção curada de palavras adequadas para a faixa etária, categorizadas por nível de dificuldade (Fácil, Médio, Difícil) com base em tamanho e frequência de uso. Usada pelo Caça-Palavras e Cruzadinha.
- **Crossword Puzzle (Tabuleiro de Cruzadinha)**: Estrutura de tabuleiro com posições de palavras, orientações (horizontal/vertical), e dicas associadas a cada palavra.
- **Emoji Dictionary (Dicionário de Emojis)**: Mapeamento de emojis para listas de palavras válidas. Cada entrada contém o emoji, as palavras aceitas como resposta, e metadados de adequação à faixa etária.
- **Player Score (Pontuação)**: Registro de pontuação por jogo e por nível de dificuldade, contendo pontuação da partida, recorde pessoal, melhor classificação de estrelas, e data da última partida.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Crianças conseguem abrir o app e iniciar qualquer jogo em menos de 10 segundos desde o toque no ícone do app.
- **SC-002**: Crianças de 6 a 10 anos conseguem jogar qualquer jogo sem instruções externas (de adultos) — a interface é autoexplicativa.
- **SC-003**: O app funciona 100% offline após o primeiro carregamento, incluindo todos os jogos e persistência de dados.
- **SC-004**: Transições entre telas completam em menos de 300ms percebidos pelo usuário.
- **SC-005**: Animações de jogo mantêm 60fps consistentes no dispositivo mínimo suportado.
- **SC-006**: Um novo jogo pode ser adicionado ao catálogo e estar jogável sem modificar o código de nenhum jogo existente.
- **SC-007**: 90% das crianças na faixa etária alvo conseguem completar pelo menos uma partida de qualquer jogo na primeira tentativa.
- **SC-008**: Pontuações e recordes persistem corretamente entre sessões do app, mesmo após fechamento e reabertura.
- **SC-009**: O app é instalável como PWA na tela inicial de smartphones Android e iOS.
- **SC-010**: Todos os elementos de toque possuem área mínima de 44x44px e o texto é legível em telas de 320px de largura.

## Assumptions

- O público-alvo são crianças de até 10 anos, com ênfase na faixa de 6 a 10 anos (crianças já alfabetizadas ou em processo de alfabetização).
- O idioma do app e de todo o conteúdo dos jogos é Português Brasileiro.
- Não há necessidade de autenticação ou contas de usuário — todos os dados são locais ao dispositivo.
- Não há recursos sociais, rankings competitivos ou interação entre usuários.
- O conteúdo (bancos de palavras, dicas, dicionário de emojis) é curado e empacotado com o app, sem necessidade de download adicional.
- Sons/áudio não são requisito para o primeiro lançamento — o feedback é exclusivamente visual e de animação.
- O suporte a tablets é desejável mas não prioritário; o foco é smartphone.
- A curadoria do dicionário de emojis considera apenas emojis amplamente suportados pelos sistemas operacionais modernos (Unicode padrão).
- Controles parentais e restrições de tempo de uso estão fora do escopo desta versão.
- O app não coleta dados pessoais e não requer política de privacidade complexa, pois não há comunicação com servidores.
