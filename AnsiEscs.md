# AnsiEscs.ts


# **AnsiEscs.Format** - *Classe de estilos de texto ANSI*

```typescript

import { Format as f } from "./AnsiEscs.Format"
let line = "Textos coloridos: "

// Exemplo de uso do da classe
// para estilização de texto ANSI

line += '\n- ' + f.fg(31).bg(47).dc('bold', 'underline').tx("erro")
line += '\n- ' + f.fg(33).tx("atenção")
line += '\n- ' + f.fg(32).tx("sucesso")
line += '\n- ' + f.fg(34).tx("informação")
line += '\n- ' + f.fg(35).tx("debug")
line += '\n- ' + f.fg(36).tx("processando")
line += '\n- ' + f.fg(30).bg(43).dc('bold').tx("aviso")
line += '\n- ' + 'a cor padrão foi restaurada'
console.log(line)
```

## Resultado:
> ![AnsiEscs.format example](./AnsiEscs.format.png)