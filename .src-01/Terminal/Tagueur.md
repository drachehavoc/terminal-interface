# Tagueur

A classe `Tagueur` fornece uma interface para estilizar e posicionar texto no terminal, 
permitindo a aplicação de cores e decorações ao texto impresso.

Origem do nome: do francês "tagueur", que significa "pichador" ou "grafiteiro", 
referindo-se à capacidade de "marcar" o terminal com estilos e posições específicas.
permitindo a aplicação de cores e decorações ao texto impresso.

## Lista de métodos


| Estático | Método          | parametros             | retorno                            | descrição |
|:--------:|-----------------|------------------------|----------------------------------- |-----------|
| static   | `foreground`    | `ForegroundColorsKeys` | `Tagueur`                          | cria uma nova instância de Tagueur com a cor de primeiro plano especificada |
| static   | `background`    | `BackgroundColorsKeys` | `Tagueur`                          | cria uma nova instância de Tagueur com a cor de fundo especificada |
| static   | `decorations`   | `...DecorationsKeys[]` | `Tagueur`                          | cria uma nova instância de Tagueur com as decorações especificadas |
| static   | `bold`          |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração negrito adicionada |
| static   | `dim`           |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração dim adicionada |
| static   | `italic`        |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração itálico adicionada |
| static   | `underline`     |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração sublinhado adicionada |  
| static   | `blink`         |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração piscar adicionada |
| static   | `inverse`       |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração inverso adicionada |
| static   | `hidden`        |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração oculto adicionada |
| static   | `strikethrough` |                        | `Tagueur`                          | cria uma nova instância de Tagueur com a decoração tachado adicionada |
| static   | `print`         | `{top, left}` `string` | `Tagueur`                          | imprime o texto na posição especificada com os estilos da instância atual |
|          | `foreground`    | `ForegroundColorsKeys` | `Tagueur`                          | define a cor de primeiro plano para a instância atual |
|          | `background`    | `BackgroundColorsKeys` | `Tagueur`                          | define a cor de fundo para a instância atual |
|          | `decorations`   | `...DecorationsKeys[]` | `Tagueur`                          | define as decorações para a instância atual |
|          | `bold`          | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração negrito na instância atual |
|          | `dim`           | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração dim na instância atual |
|          | `italic`        | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração itálico na instância atual |
|          | `underline`     | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração sublinhado na instância atual |
|          | `blink`         | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração piscar na instância atual |
|          | `inverse`       | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração inverso na instância atual |
|          | `hidden`        | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração oculto na instância atual |
|          | `strikethrough` | `boolean?`             | `Tagueur`                          | adiciona ou remove a decoração tachado na instância atual |
|          | `print`         | `{top, left}` `string` | `Tagueur`                          | imprime o texto na posição especificada com os estilos da instância atual |
|          | `getStamper`    |                        | `({top, left}, string) => Tagueur` | retorna uma função que aplica os estilos da instância atual ao texto na posição especificada |
|          | `getAnchor`     | `{top, left, width}`   | `(string) => Tagueur`              | retorna uma função que imprime o texto sempre na mesma posição e largura com os estilos da instância atual |


> Legenda dos parâmetros:
> ---
> - **ForegroundColorsKeys** 
>   - chaves válidas para cores de primeiro plano: 
>   - `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray` 
      `brightBlack` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta` 
      `brightCyan` `brightWhite`
> - **BackgroundColorsKeys** 
>   - chaves válidas para cores de fundo: 
>   - `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray` 
      `brightBlack` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta` 
      `brightCyan` `brightWhite`
> - **DecorationsKeys** 
>   - chaves válidas para decorações de texto: 
>   - `bold` `dim` `italic` `underline` `blink` `inverse` `hidden` `strikethrough` 
> - **top** 
>   - número inteiro que representa posição vertical (linha) onde o texto será impresso no 
      terminal  
> - **left** 
>   - número inteiro que representa posição horizontal (coluna) onde o texto será impresso 
      no terminal  
> - **width** 
>   - número inteiro que representa largura máxima do texto a ser impresso (utilizado para 
      truncar textos long

> @todo: melhor descrições dos parametros das funções


## Utilização Básica (utilizando o construtor)

É possível criar instâncias da classe Tagueur para aplicar estilos específicos ao texto 
no terminal. Apenas crie uma instância com as cores e decorações desejadas, e então
utilize o método print para exibir o texto na posição especificada.

```typescript
import { Tagueur } from "./src/Terminal/Tagueur"

const tagueur = new Tagueur({
  foreground: 'green',
  background: 'black',
  decorations: ['bold', 'underline'],
})

// uso simples
tagueur.print({ top: 1, left: 2 }, "Seimple Hello from Tagueur!")

// uso com encadeamento e com adição e remoção de estilos
tagueur
  .print({ top: 3, left: 2 }, "Hello from Tagueur!")
  .inverse()
  .print({ top: 4, left: 2 }, "Chained print works too!")
  .inverse(false)
  .print({ top: 5, left: 2 }, "And styles can be removed too!")
```

## Utilização Estática (métodos encadeados)

Para cada método que estiliza ou posiciona o texto, a classe Tagueur oferece uma versão
estática que pode ser encadeada. Isso permite construir estilos complexos de forma fluida
sem a necessidade da utilização de `new`.

```typescript
import { Tagueur } from "./src/Terminal/Tagueur"

Tagueur
  .foreground('green')
  .background('red')
  .bold()
  .underline()
  .italic()
  .print({ top: 2, left: 2 }, "Hello with static Tagueur!")

Tagueur
  .foreground('green')
  .background('red')
  .decorations('bold', 'underline', 'italic') // equivalente às chamadas acima
  .print({ top: 3, left: 2 }, "Hello with static Tagueur!")
```


## Reutilização de estilos e posicionamnto os métodos getStamper & getAnchor

A classe possiu dois métodos especiais para reutilização de estilos e posicionamento, 
estes metodos retornam funções que aplicam estilos e/ou posicionamento fixos ao texto.

### getStamper

O método `getStamper` retorna uma função que aplica os estilos definidos a um texto porém
exige que a posição seja informada a cada chamada.

```typescript
import { Tagueur } from "./src/Terminal/Tagueur"

const stamper = Tagueur
  .foreground('yellow')
  .background('blue')
  .bold()
  .underline()
  .getStamper()

stamper({ top: 2, left: 2 }, "Reusable styled text!")
stamper({ top: 3, left: 2 }, "Reusable styled text! - again!")
stamper({ top: 4, left: 2 }, "Reusable styled text! - and again!")
``` 

### getAnchor

O método `getAnchor` retorna uma função que aplica os estilos definidos a um texto e
imprime o texto sempre na mesma posição e largura. 

```typescript
import { Tagueur } from "./src/Terminal/Tagueur"

let interval: NodeJS.Timer | undefined = undefined

const randomTexts = [
  "This is a line thats very long and will exceed the width",
  "This is a big line that does exceed width",
  "This is one line",
  "Short line",
  "Tiny",
]

const anchor = Tagueur
  .foreground('cyan')
  .background('black')
  .italic()
  .getAnchor({ top: 2, left: 2, width: 30 })

if (interval) {
  clearInterval(interval)
}

interval = setInterval(() => {
  const text = randomTexts[Math.floor(Math.random() * randomTexts.length)]
  anchor(text as string)
}, 1000)
```

## @TODO: falar sobre posicionamento relativo e absoluto

```typescript
import { drawColNums, drawRowNums } from "./src/Terminal/Debugger";
import { coord, type Square, type TCoord } from "./src/Terminal/Math";
import { Tagueur } from "./src/Terminal/Tagueur";

const t = new Tagueur()

const offset = .1

const sqCenter = coord.square(
  coord.responsive(.5 - offset, .5 - offset),
  coord.responsive(.5 + offset, .5 + offset)
)

const rezize = null// { top: 2, left: 4 }

const sqTopLeft = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => -sqCenter.height -1, 
    () => -sqCenter.width -1
  ),
  rezize
)

const sqTop = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => -sqCenter.height -1, 
    () => 0
  ),
  rezize
)

const sqTopRight = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => -sqCenter.height -1, 
    () => sqCenter.width +1
  ),
  rezize
)

const sqRight = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => 0, 
    () => sqCenter.width +1
  ),
  rezize
)
const sqBottomRight = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => sqCenter.height +1, 
    () => sqCenter.width +1
  ),
  rezize
)

const sqBottom = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => sqCenter.height +1, 
    () => 0
  ),
  rezize
)

const sqBottomLeft = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => sqCenter.height +1, 
    () => -sqCenter.width -1
  ),
  rezize
)

const sqLeft = sqCenter.cloneTranslatedBy(
  coord.dynamic(
    () => 0, 
    () => -sqCenter.width -1
  ),
  rezize
)

Tagueur.hideCursor()

Tagueur.onRefresh(() => {
  drawColNums()
  drawRowNums()

  Tagueur
    .drawSquare(sqCenter)
    .drawSquare(sqTopLeft)
    .drawSquare(sqTop)
    .drawSquare(sqTopRight)
    .drawSquare(sqRight)
    .drawSquare(sqBottomLeft)
    .drawSquare(sqBottom)
    .drawSquare(sqBottomRight)
    .drawSquare(sqLeft)
})
```