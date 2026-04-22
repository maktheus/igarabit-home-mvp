# Regras de Contexto de Ouro para IAs - Igarabit MVP

Seja você um Desenvolvedor ou uma Inteligência Artificial lendo este código, você **deve estritamente aderir às regras abaixo** antes de sugerir ou executar qualquer alteração neste repositório. O objetivo é evitar a degradação silenciosa (silently breaking) de funcionalidades cruciais de design em nome da "refatoração cega".

## REGRA DE OURO 1: NUNCA Quebre o Fluxo de "Scroll Snap"
O layout de Feed foca na atenção completa a um cartão por vez. 
- O elemento `#feed` utiliza `scroll-snap-type: y proximity`. 
- Os elementos `.card` utilizam `scroll-snap-align: center`. 
- **⚠️ NUNCA altere isso para um layout "Grid Múltiplo"**. Mesmo em tamanhos de desktop (Wide Screens), o Feed deve se manter em **Colunas Únicas** limitadas a ~480px centrais (Comportamento de Feed Imersivo).

## REGRA DE OURO 2: O Perigo da "Expansão de Cards em Loop"
Devido à mecânica de Scroll Snap + Automação Vanilla JS, existe um risco permanente de "Loop Infinito de Colapso" no Feed.
Se você alterar a altura do `.card.is-active`, o DOM sofre reflow e o navegador força a rolagem (scroll) para tentar se encaixar. Se a escuta de rolagem não estiver protegida:
- O card tenta abrir -> Janela Rola Pela Metade -> O evento `scroll` ouve a rolagem -> Força o fechamento imediato do card.
- **A Solução "Lock":** O JS em `main.js` utiliza uma variável global (`ignoreCollapse = true; setTimeout(() => ignoreCollapse = false, 650);`). **Jamais remova isso ou diminua o delay**, pois o GSAP e as transições CSS precisam de pelo menos 600ms para estabilizar a caixa no DOM.

## REGRA DE OURO 3: O Padrão de Animações CSS VS GSAP
- **Use CSS para Mudanças de Estado Físico:** Expansões (width, max-height) de divs que ditam layout **devem usar transition puro em CSS**. O CSS Engine dos navegadores (Gecko/Blink) lida muito melhor com o repintar em caixas de flexbox.
- **Use GSAP para "Aparecimentos e Refinamentos":** Efeitos como "Surgimento em Cascata (Stagger)", "Fade In Vertical Rápido" e "Controles de Escala Elásticos" na Bottom Nav devem permanecer 100% controlados pelas timelines do GSAP.
- **Nunca aplique transições complexas em `#app`:** Deixe todo o motor de transição confinado ao elemento folha e não ao recipiente primário, para não encavalar layouts.

## REGRA DE OURO 4: Paleta de Luxo
O design da plataforma utiliza variáveis CSS para a consistência extrema das cores.
Não crie regras no arquivo local de estilo (`style.css`) fixando (hardcoding) cores hexadecimais brutas.
Sempre utilize as variáveis criadas no pseudo-seletor `:root`.
- Cor de fundo dos modais: `var(--cream)`
- Botões Fortes: `var(--terra)`
- Textos Leves/Diminuídos em fundos escuros: `rgba(248, 238, 215, 0.65)` (Creme com transparência) e nunca um "cinza genérico" (`#888`). As transparências precisam derivar das cores bases para manter a harmonização cromática.
