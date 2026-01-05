# LazyLayoutMath

**LazyLayoutMath** é um conjunto de utilitários para trabalhar com valores numéricos relativos, calculados sob demanda, que podem ser compostos para formar posições e áreas.

Em vez de usar números fixos diretamente, a biblioteca trabalha com objetos que implementam a interface `FutureNumber`.  
Um `FutureNumber` é simplesmente um objeto que possui uma propriedade `value`, que retorna um número no momento em que é acessada.

A principal vantagem desse modelo é que o valor não precisa ser conhecido antecipadamente. Ele pode ser calculado dinamicamente com base em outros valores atuais ou futuros, como o tamanho de uma tela, de um contêiner ou qualquer outro estado mutável.

Isso permite criar cálculos relativos, como porcentagens, sem precisar recalcular tudo manualmente quando o contexto muda. Sempre que `value` é acessado, o número retornado reflete o estado mais recente.

Esses valores podem ser compostos em estruturas como `Coordinate` e `Square`, permitindo descrever posições e áreas de forma declarativa, enquanto a lógica de cálculo permanece desacoplada da lógica de uso ou renderização.

A biblioteca é especialmente útil em cenários onde o layout precisa se adaptar a mudanças dinâmicas, como em interfaces de terminal, jogos ou qualquer sistema baseado em espaço relativo.

> ⚠ **Nota:** Todos os exemplos abaixo usam a classe `Terminal` para demonstrar o uso prático dos conceitos, mas a biblioteca `LazyLayoutMath` é independente e pode ser usada em qualquer contexto que requeira cálculos numéricos dinâmicos.

> ⚠ **Nota:** Os exemplos demonstram o uso direto das classes. No entanto o projeto conta com uma série de de funções auxiliares para facilitar a criação de instâncias, como `percent`, `coordinate`, `square`, Leia mais na seção ["Funções Auxiliares"][helper-functions-link] abaixo.

[helper-functions-link]: #helper-functions

## FutureNumber

`FutureNumber` é a interface base da biblioteca.

Ela representa um número que é resolvido apenas quando necessário.  
Qualquer classe que implemente essa interface pode ser usada como fonte de valores dinâmicos em cálculos, coordenadas ou áreas.

## Percentage

A classe `Percentage` representa um valor calculado a partir de uma porcentagem e de um total.

Em vez de armazenar um número fixo, ela calcula o valor final apenas quando a propriedade `value` é acessada.  
O total usado no cálculo pode ser um número fixo ou uma função que retorna um número, o que torna o cálculo totalmente dinâmico.

Isso é especialmente útil quando o valor de referência pode mudar com o tempo, como o tamanho de um contêiner, uma tela ou qualquer outro limite variável.

Exemplo usando o terminal:

```typescript
import { Terminal } from "./Terminal"
import { Percentage } from "./LazyLayoutMath"

// Cria um valor que representa 50% da largura do terminal
const halfWidth = new Percentage({
  percent: 0.5,
  getTotal: () => Terminal.width,
})

// Em algum momento do código, quando o valor é necessário:
// Se o terminal for redimensionado, halfWidth.value refletirá
//  a nova largura automaticamente
function render() {
  Terminal.clear()
  Terminal.moveCursorTo(1, 1)
  Terminal.write(`A metade da largura do terminal é: ${halfWidth.value}\n`)

}

// Renderiza inicialmente
Terminal.onResize(render)
Terminal.waitInput()
render()
```

## Coordinate

A classe `Coordinate` representa uma posição bidimensional, composta por dois valores que implementam `FutureNumber`: um horizontal e um vertical.

Ela não sabe como esses valores são calculados.  
Sua única responsabilidade é expor os valores resolvidos no momento do uso.

Isso permite que uma coordenada seja definida usando valores absolutos, relativos ou qualquer combinação dos dois, mantendo o cálculo desacoplado da lógica que consome esses valores.

Exemplo usando o terminal:

```typescript
import { Terminal } from "./Terminal"
import { Percentage, Coordinate } from "./LazyLayoutMath"

// Valores relativos à largura e altura do terminal
const centerX = new Percentage({
  percent: 0.5,
  getTotal: () => Terminal.width,
})

const centerY = new Percentage({
  percent: 0.5,
  getTotal: () => Terminal.height,
})

// Coordenada que representa o centro do terminal
const center = new Coordinate(centerY, centerX)

// Renderiza algo sempre no centro da tela
function render() {
  
  Terminal
    .clear()
    .moveCursorTo(1, 1)
    .write(`O ✚ esta no centro do terminal! (${center.horizontal}, ${center.vertical})`)
    .moveCursorTo(...center.hv)
    .write('✚')
}

// Sempre que o terminal mudar de tamanho,
// a coordenada será recalculada automaticamente
Terminal.onResize(render)
Terminal.waitInput()
render()
```

## Square

A classe `Square` representa uma área retangular definida por duas coordenadas: o canto superior esquerdo e o canto inferior direito.

O `Square` não armazena largura ou altura diretamente.  
Esses valores são sempre calculados a partir das coordenadas fornecidas.

Isso faz com que o `Square` seja uma descrição de área, e não um valor estático.  
Seu uso é recomendado em conjunto com `Coordinate` e `FutureNumber`, permitindo definir áreas relativas a qualquer espaço de referência.

```typescript
import { Terminal } from "./Terminal"
import { Percentage, Coordinate, Square } from "./LazyLayoutMath"

// Define percentuais baseados no tamanho atual do terminal
const fromTop    = new Percentage({ percent: .25, getTotal: () => Terminal.height })
const fromLeft   = new Percentage({ percent: .25, getTotal: () => Terminal.width })
const fromBottom = { get value() { return Terminal.height - fromTop.value + 1 } }
const fromRight  = { get value() { return Terminal.width - fromLeft.value } }

// Define um quadrado baseado nas coordenadas percentuais
const sqr = new Square({
  tl: new Coordinate(fromTop, fromLeft),
  br: new Coordinate(fromBottom, fromRight),
})

// Função para desenhar o quadrado no terminal
function render() {
  const { 
    top   : t,
    right : r,
    bottom: b,
    left  : l,
    width : w,
    height: h
  } = sqr

  Terminal
      .clear()

  // Desenha as descrições dos cantos tl, tr, br, bl
  Terminal
    .moveCursorTo(t, l-2).write(`tl`)
    .moveCursorTo(t, r+1).write(`tr ${t} ${Terminal.height - t}`)
    .moveCursorTo(b, r+1).write(`br ${b}`)
    .moveCursorTo(b, l-2).write(`bl`)
    
  // Desenha as bordas horizontais
  Terminal
    .moveCursorTo(t, l).write(`┌${'─'.repeat(w-1)}┐`)
    .moveCursorTo(b, l).write(`└${'─'.repeat(w-1)}┘`)

  // Desenha as bordas verticais
  for (let i = 1; i < h; i++) {
    Terminal
      .moveCursorTo(t + i, l).write(`│`)
      .moveCursorTo(t + i, r).write(`│`)
  }
}

// Sempre que o terminal mudar de tamanho,
// a coordenada será recalculada automaticamente
Terminal.onResize(render)
Terminal.waitInput()
render()
```

## Funções Auxiliares
<a name="helper-functions"></a>

## Filosofia da Biblioteca

- Evitar números fixos quando o valor pode mudar  
- Resolver valores apenas quando eles são necessários  
- Compor valores simples em estruturas maiores  
- Separar a lógica de cálculo da lógica de uso

Embora o terminal seja um exemplo comum, os mesmos conceitos podem ser aplicados a layouts de interface, jogos, grids, canvas ou qualquer outro sistema baseado em espaço relativo.

