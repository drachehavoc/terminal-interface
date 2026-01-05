# terminal-interface


## Instalação

Antes da execução executar o script de instalação com o `runtime` desejado, para que os
pacotes necessários para seu ambiente sejam instalados, veja os comandos abaixo:

- Instala os pacotes para o Bun
  - `bun modules-install.js` 
- Instala os pacotes para o Node.js
  - `node modules-install.js` 
- Instala os pacotes para o Deno
  - `deno --allow-env --allow-run modules-install.js` 


## SpawnCage

## Peculiaridades

- No *Bun*, o módulo `bun-pty` é utilizado para criar pseudoterminais, não esta no 
  package.json, pois o Bun lida com a instalação automaticamente ao importar o módulo.
- No *Node.js*, o módulo `@lydell/node-pty` é utilizado para criar pseudoterminais, 
  e também não esta no package.json, pois no momento da importação ele é instalado.


## Area

Reserva um espaço na tela do terminal para exibir informações, é responsável por:
- Definir a área (posição e tamanho)
- Atualizar o conteúdo exibido
- Limpar a área quando necessário
- Clipping: Garante que o conteúdo não ultrapasse os limites da área definida.
- Caso conteúdo ultrapasse o tamanho da área, ele será cortado para caber dentro dos permitindo barra de rolagem ou redimensionamento da área.

## SubArea


 
