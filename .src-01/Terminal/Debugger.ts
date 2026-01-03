import { Tagueur } from "./Tagueur"

export const drawColNums = () => {
  const t = new Tagueur()

  for (let i = 0; i < process.stdout.columns; i++) {
    let col = i % 10
    if (col === 0) {
      t.foreground("red").print({ y: 0, x: i }, '+')
      continue
    }
    t.foreground("green").print({ y: 0, x: i }, col.toString())
  }
}

export const drawRowNums = () => {
  const t = new Tagueur()
  for (let i = 0; i < process.stdout.rows; i++) {
    const row = i % 10
    if (row === 0) {
      t.foreground("red").print({ y: i, x: 0 }, '+')
      continue
    }
    t.foreground("blue").print({ y: i, x: 0 }, row.toString())
  }
}

export const mouseDebugger = () => {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdout.write('\x1b[?1002h'); // Enable mouse tracking
  process.stdout.write('\x1b[?1003h'); // Enable mouse motion tracking



  process.stdin.on('data', (buffer) => {
    const str = buffer.toString().replace(/\x1b/g, '\\x1b');

    const c = {
      32: 'left click',
      33: 'middle click',
      34: 'right click',
      35: 'release',
      96: 'scroll up',
      97: 'scroll down',
      67: 'move',
      64: 'move drag',
    }[<number>buffer[3]]
    const x = <number>buffer[4]
    const y = <number>buffer[5]
    const r = [str, x, y, buffer[3]?.toString()]

    process.stdout.write(`\x1b[0;0H`);
    console.log(r.join(";").padEnd(process.stdout.columns, ' '));

    process.stdout.write(`\x1b[${y - 32};${x - 32}H${c}`);
  })

}