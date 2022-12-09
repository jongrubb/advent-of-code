// https://adventofcode.com/2022/day/9

import { readLine } from '../common/readInput';
import { sortByProperty } from '../common/utils';

type Move = 'U' | 'D' | 'L' | 'R';

interface Position { x: number, y: number }

function moveKnot (knot: Position, move: Move): void {
  switch (move) {
    case 'U': {
      knot.y += 1;
      break;
    }
    case 'D': {
      knot.y -= 1;
      break;
    }
    case 'L': {
      knot.x -= 1;
      break;
    }
    case 'R': {
      knot.x += 1;
      break;
    }
  }
}

function areKnotsOnTop (knot1: Position, knot2: Position): boolean {
  return knot1.x === knot2.x && knot1.y === knot2.y;
}

function areKnotsDiagonal (knot1: Position, knot2: Position): boolean {
  const absColumnDiff = Math.abs(knot1.x - knot2.x);
  const absRowDiff = Math.abs(knot1.y - knot2.y);
  return absColumnDiff === 1 && absRowDiff === 1;
}

function areKnotsNextToEachother (knot1: Position, knot2: Position): boolean {
  const absColumnDiff = Math.abs(knot1.x - knot2.x);
  const absRowDiff = Math.abs(knot1.y - knot2.y);
  return (absColumnDiff === 0 && absRowDiff === 1) || (absColumnDiff === 1 && absRowDiff === 0);
}

function placeTail (headPosition: Position, tailPosition: Position): void {
  const xDiff = headPosition.x - tailPosition.x;
  const yDiff = headPosition.y - tailPosition.y;

  let xMove: Move | null = null;
  let yMove: Move | null = null;

  if (xDiff < 0) {
    xMove = 'L';
  }
  if (xDiff > 0) {
    xMove = 'R';
  }

  if (yDiff < 0) {
    yMove = 'D';
  }
  if (yDiff > 0) {
    yMove = 'U';
  }

  if (xMove !== null && Math.abs(xDiff) > 0) {
    moveKnot(tailPosition, xMove);
  }

  if (yMove !== null && Math.abs(yDiff) > 0) {
    moveKnot(tailPosition, yMove);
  }
}

function printKnots (knots: Position[]): void {
  const minX = [...knots].sort((a, b) => sortByProperty(a, b, (x) => x.x))[0].x;
  const maxX = [...knots].sort((a, b) => sortByProperty(a, b, (x) => x.x)).reverse()[0].x;
  const minY = [...knots].sort((a, b) => sortByProperty(a, b, (x) => x.y))[0].y;
  const maxY = [...knots].sort((a, b) => sortByProperty(a, b, (x) => x.y)).reverse()[0].y;

  for (let i = maxY + 1; i >= minY - 1; i--) {
    let rowString = `${i}\t.`;
    for (let j = minX; j <= maxX; j++) {
      const knotIndex = knots.findIndex(k => k.y === i && k.x === j);
      rowString += ` ${knotIndex === -1 ? (i === 0 && j === 0 ? 'S' : '.') : `${knotIndex}`}`;
    }
    console.log(rowString);
  }
}

function moveKnots (knots: Position[], move: Move, amount: number, tailPositionMap: Record<string, boolean>): void {
  for (let step = 0; step < amount; step++) {
    for (const [knotNumber, knot] of knots.entries()) {
      if (knotNumber === 0) {
        moveKnot(knot, move);
      } else {
        const headPosition = knots[knotNumber - 1];
        const tailPosition = knot;

        if (!(
          areKnotsOnTop(headPosition, tailPosition) ||
            areKnotsDiagonal(headPosition, tailPosition) ||
            areKnotsNextToEachother(headPosition, tailPosition)
        )) {
          placeTail(headPosition, tailPosition);

          if (knotNumber === knots.length - 1) {
            tailPositionMap[`${tailPosition.y}|${tailPosition.x}`] = true;
          }
        }
      }
    }
  }
}

void (async () => {
  const knots: Position[] = Array(2).fill(null).map(() => ({ x: 0, y: 0 }));

  const tailPositionMap: Record<string, boolean> = { '0|0': true };

  await readLine(9, (line, lineNumber) => {
    const parsedLine = line.split(' ');

    const move = parsedLine[0] as Move;
    const amount = parseInt(parsedLine[1], 10);

    moveKnots(knots, move, amount, tailPositionMap);
  });

  console.log('part1', Object.keys(tailPositionMap).length);
})();

void (async () => {
  const knots: Position[] = Array(10).fill(null).map(() => ({ x: 0, y: 0 }));

  const tailPositionMap: Record<string, boolean> = { '0|0': true };

  await readLine(9, (line, lineNumber) => {
    const parsedLine = line.split(' ');

    const move = parsedLine[0] as Move;
    const amount = parseInt(parsedLine[1], 10);

    moveKnots(knots, move, amount, tailPositionMap);
  });

  console.log('part2', Object.keys(tailPositionMap).length);
})();
