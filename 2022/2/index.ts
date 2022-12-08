// https://adventofcode.com/2022/day/2

import { readLine } from '../common/readInput';
import { RPS, RPSGame, winMap, loseMap, rpsMap } from './RPSGame';

const games2RpsValue: Record<string, (opponent: RPS) => RPS> = {
  X: (opponent: RPS) => loseMap[opponent],
  Y: (opponent: RPS) => opponent,
  Z: (opponent: RPS) => winMap[opponent]
};

void (async () => {
  const moves: RPSGame[] = [];
  const moves2: RPSGame[] = [];

  await readLine(2, (line) => {
    const [opponent, me] = line.split(' ');

    moves.push(new RPSGame(rpsMap[opponent], rpsMap[me]));
    moves2.push(new RPSGame(rpsMap[opponent], games2RpsValue[me](rpsMap[opponent])));
  });

  let completeScore = 0;

  moves.forEach(m => { completeScore += m.getScore(); });

  console.log(completeScore);

  let completeScore2 = 0;

  moves2.forEach(m => { completeScore2 += m.getScore(); });

  console.log(completeScore2);
})();
