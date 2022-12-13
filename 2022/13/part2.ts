// https://adventofcode.com/2022/day/13

import { readAll } from '../common/readInput';

type PairValue = PairValue[] | number;

function isInRightOrder (left: PairValue | undefined, right: PairValue | undefined): boolean | null {
  if (left === undefined) {
    return true;
  }
  if (right === undefined) {
    return false;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      return true;
    }
    if (left > right) {
      return false;
    }
    return null;
  }

  if (typeof left === 'number') {
    left = [left];
  }
  if (typeof right === 'number') {
    right = [right];
  }

  const maxLength = Math.max(left.length, right.length);

  for (let i = 0; i < maxLength; i++) {
    const result = isInRightOrder(left[i], right[i]);
    if (result !== null) {
      return result;
    }
  }

  return null;
}

void (async () => {
  const pairValues: PairValue[] = [];

  const chunks = await readAll(13).split('\n\n');
  chunks.forEach((chunk, i) => {
    const [left, right] = chunk.split('\n');

    pairValues.push(JSON.parse(left), JSON.parse(right));
  });

  pairValues.push([[2]], [[6]]);

  pairValues.sort((a, b) => isInRightOrder(a, b) === true ? 0 : -1).reverse();

  pairValues.forEach(p => console.log(JSON.stringify(p)));

  const a = pairValues.findIndex(p => JSON.stringify(p) === JSON.stringify([[2]])) + 1;
  const b = pairValues.findIndex(p => JSON.stringify(p) === JSON.stringify([[6]])) + 1;

  console.log(a * b);
})();
