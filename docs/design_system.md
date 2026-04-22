# Design System - Igarabit MVP

Este documento define os "padrões de ouro" de UI/UX utilizados no projeto Igarabit. O design foi concebido para entregar uma estética "premium", minimalista e regional (Música, Arte e Cultura do Norte do Brasil).

## Paleta de Cores (Design Tokens)

As cores foram escolhidas para evocar a natureza e a cultura amazônica, ao mesmo tempo mantendo um contraste moderno adequado para aplicações web.

```css
:root {
  /* Tons Principais (Natureza & Cultura) */
  --green: #789B55;      /* Verde Oliva Base - Usado em botões primários e backgrounds */
  --green-lt: #8DB663;   /* Verde Oliva Claro - Usado para hovers e gradientes */
  
  --terra: #DC4A38;      /* Terracota Claro - Usado para CTAs (Call to Actions) e Destaques */
  --terra-dk: #A8311A;   /* Terracota Escuro - Usado em tipografia de alto contraste sobre fundos claros */

  /* Tons Neutros e Acentos */
  --cream: #F8EED7;      /* Creme / Off-White - Cor de fundo primária de cards e telas de app */
  --gold: #F2BA33;       /* Dourado - Usado para selos especiais (ex: selo de música), labels e letreiros */
}
```

## Tipografia

O projeto utiliza o sistema de fontes do Google Fonts com foco em clareza, leitura e elegância de luxo.

1. **Heading (Títulos)**: `Playfair Display`, serif. (Usado em logos, títulos hero e elementos artísticos).
2. **Base (Corpo)**: `Inter`, sans-serif. (Usado para o texto geral do aplicativo, labels e descrições).
3. **Display (Impacto)**: `Outfit`, sans-serif. (Usado para títulos de seção de alto peso `font-weight: 800`).

## Componentes Chave

### 1. Botões (CTAs)
- **Primary (.btn-t / .btn-terra):** Fundo vermelho terracota (`var(--terra)`). Sombra suave `rgba(220,74,56,0.3)`. Efeito de clique: `transform: scale(0.97)`.
- **Secondary (.btn-g):** Fundo verde (`var(--green)`). Efeito de clique em escala.
- **Ghost (.btn-ghost-terra):** Fundo transparente com borda de `2px solid`. Ideal para ações secundárias no fundo vermelho escuro.

### 2. Cards Interativos (O "Padrão Ouro" do Feed)
Os cards utilizam o conceito de "Glassmorphism" adaptado para um "Cream-morphism" suave.
- **Estrutura:** `border-radius: 24px`, background `var(--cream)`, bordas arredondadas e uso extremo de Sombras em camadas (`box-shadow: 0 8px 24px rgba(0,0,0,0.15)`).
- **Expandable State (.is-active):** Quando aberto, a sombra muda de tom, focando um brilho no elemento expandido (`0 24px 60px -16px rgba(168,49,26,0.3)`) e recebendo uma borda sutil de destaque (`box-shadow: 0 0 0 2px var(--terra)`).

### 3. Padrões de Layout Responsivo (Mobile-First de Luxo)
- **Web/Desktop (>= 768px):** A tela assume uma estrutura de grid fluída com colunas centrais balanceadas. A navegação inferior (`nav`) é fixada na base do container e a barra superior (`hd`) no topo. O espaçamento `gap` aumenta para respiro.
- **Mobile (< 768px):** O aplicativo assume o formato imersivo padrão (App-Like), travando a largura máxima em `480px` na tela e priorizando navegação com uma só mão.

## Efeitos Animados de Alto Valor

O design de UX de alto valor não se baseia em interações bruscas, mas em transições perfeitamente balanceadas:
1. **Scroll Snapping:** Experiência similar a aplicações modernas (TikTok, Shorts) onde os cards "puxam" para o centro automaticamente.
2. **GSAP Animations:** As entradas de tela (`.screen`) sobem da base (`translateY(100%)`) via CSS e os elementos internos pipocam via GSAP com o *easing* `power2.out`, com delays calculados para dar a sensação orgânica.
