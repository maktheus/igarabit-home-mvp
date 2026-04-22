# Arquitetura do Igarabit MVP

Este projeto foi intencionalmente construído com uma arquitetura **Single-Page Vanilla (sem frameworks como React, Vue ou Angular)** para máxima performance e controle absoluto sobre animações e estado em sua versão inicial de MVP.

A estrutura atual baseia-se em 3 pilares fundamentais:
1. **`index.html`**: O esqueleto da aplicação e templates de interface.
2. **`style.css`**: Toda a camada de design system e layouts fluidos responsivos.
3. **`main.js`**: Lógica de negócios de front-end, estado (State Machine) e controle de animações.

## Estrutura do Documento e Navegação (State Machine)

A aplicação não utiliza rotas do navegador (URLs). A navegação ocorre por manipulação da árvore DOM usando a classe CSS `.open` nas "Telas" (Screens).

As telas ficam ocultas ou fora do campo de visão (`translateY(100%)`) e deslizam para o viewport quando ativadas via JavaScript.

### Telas Principais:
- **Splash (`#splash`):** O "Landing Page Card" central. É a primeira coisa vista. Responsável pela introdução ao App. A transição deste para o App oculta o Splash e revela as barras flutuantes (`.hd`, `.nav`).
- **App Principal (`#app`):** O contêiner de tudo o que acontece "dentro da plataforma".
  - **Explore/Feed (`#feed`):** Visão padrão central. Uma lista infinita com "Scroll Snap" de eventos e conteúdos.
  - **Perfil (`#sc-profile`):** Tela modal sobreposta contendo as informações da carteira digital e histórico.
  - **Configurações (`#sc-settings`):** Tela modal sobreposta.

## Padrão de Animação e Refluxo (GSAP)

Para manter 60 FPS consistentes e evitar problemas com reflow/repaint excessivos nas propriedades DOM complexas, todo o ecossistema de micro-interações se apoia na biblioteca **GSAP**.

- **Transições de Entrada:** O GSAP é chamado via `gsap.fromTo` com opções de `stagger` para fazer com que múltiplos nós entrem em cascata, não todos de uma vez (Ex: texto aparecendo frase a frase na tela do perfil).
- **Controle Dinâmico de Cores (`_setBgPalette`):** Quando um card ativo muda, o `main.js` avisa uma função de manipulação de Root Variables (`window._setBgPalette`) e injeta no fundo do feed (`.feed-inner`) a cor predominante da arte do card em formato de Spotlight/Gradiente sutil (o que chamamos de *Aura*).

## Padrão de Componentização "Virtual"

No HTML de origem (`index.html`), o código é fatiado não em módulos independentes como JSX, mas em tags encapsuladas semanticamente:

```html
<!-- Exemplo da Máquina de Componentes HTML -->

<!-- Componente Bottom Nav -->
<nav class="nav">
  <div class="ni on" data-sc="feed">...</div>
</nav>

<!-- Componente Tela Overlap -->
<div id="sc-profile" class="screen">
   <!-- Header do Componente -->
   <div class="sc-hd">...</div>
   <!-- Corpo (Body) -->
   <div class="prof-body">...</div>
</div>
```

Ao isolar as classes e manter lógicas puras no `main.js` via `document.getElementById`, o sistema não polui o escopo global. No entanto, é vital que todos os elementos ativos do MVP tenham `IDs` únicos e precisos, não conflitantes com bibliotecas externas.

## Pipeline do Feed e Lógica de Cartões Interativos

A lógica do Feed de Cartões foi desenhada para lidar com eventos complexos sem criar bugs de loop no DOM:
1. **Ouvintes de Interação**: Cada cartão escuta Eventos de `click`, e `mouseenter` (desktop).
2. **Scroll Snap Conflitos (Proteção Ouro)**: Quando um card se expande no Feed, seu tamanho altera bruscamente, o que faz a janela saltar ("Scroll Snap"). Se permitíssemos ao Scroll continuar lendo o tempo todo, ele mandaria o card se fechar instantes após ser aberto. A arquitetura protege essa ação bloqueando escutas com a "Flag de Debounce" (`ignoreCollapse`) por exatos `650ms` (o tempo necessário para o navegador estabilizar e a animação do card terminar de expandir).
