// https://adventofcode.com/2022/day/10

import { readLine } from '../common/readInput';

type Instruction = 'addx' | 'noop';

const cycles: Record<Instruction, number> = {
  addx: 2,
  noop: 1
};

void (async () => {
  let x = 1;
  let cycle = 1;
  const cycleMap: Record<number, number> = { 1: 1 };
  await readLine(10, (line) => {
    if (line === 'noop') {
      cycle++;
      cycleMap[cycle] = x;
    } else {
      cycleMap[cycle + 1] = x;
      cycle += 2;

      const match = line.match(/^addx (-?\d+)$/);
      if (match == null) {
        throw new Error(`unknown instruction ${line}`);
      }

      const v = parseInt(match[1], 10);

      x += v;

      cycleMap[cycle] = x;
    }
  });

  let sum = 0;

  let nextC = 20;

  for (const [c, value] of Object.entries(cycleMap)) {
    const cVal = parseInt(c, 10);
    if (cVal === nextC) {
      sum += cVal * value;
      console.log(sum, cVal, value);

      nextC += 40;
    }
  }

  console.log(cycleMap, sum);

  let crt = [];

  for (const v of Object.values(cycleMap)) {
    if (crt.length === 40) {
      console.log(crt.join(' '));
      crt = [];
    }

    // console.log(v, crt.length);

    const abs = Math.abs(v - crt.length);

    crt.push([0, 1].includes(abs) ? '#' : '.');
  }
})();
