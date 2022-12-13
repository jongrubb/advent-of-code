// https://adventofcode.com/2022/day/13

import { readAll } from '../common/readInput';

type PairValue = PairValue[] | number;

class Pair {
  private _pairNumber: number;
  public get pairNumber (): number {
    return this._pairNumber;
  }

  public set pairNumber (value: number) {
    this._pairNumber = value;
  }

  private readonly left: PairValue;
  private readonly right: PairValue;

  constructor (pairNumber: number, left: PairValue, right: PairValue) {
    this._pairNumber = pairNumber;
    this.left = left;
    this.right = right;
  }

  private _isInRightOrder (left: PairValue | undefined, right: PairValue | undefined): boolean | null {
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
      const result = this._isInRightOrder(left[i], right[i]);
      if (result !== null) {
        return result;
      }
    }

    return null;
  }

  public isInRightOrder (): boolean | null {
    return this._isInRightOrder(this.left, this.right);
  }
}

void (async () => {
  const pairs: Pair[] = [];

  const chunks = await readAll(13).split('\n\n');
  chunks.forEach((chunk, i) => {
    const [left, right] = chunk.split('\n');

    pairs.push(new Pair(i + 1, JSON.parse(left), JSON.parse(right)));
  });

  const pairsInRightOrder: Pair[] = [];

  pairs.forEach((p, i) => {
    const inRightOrder = p.isInRightOrder();
    console.log(p.pairNumber, inRightOrder);
    if (inRightOrder === true) {
      pairsInRightOrder.push(p);
    }
  });

  console.log(pairsInRightOrder.reduce((sum, p) => sum + p.pairNumber, 0));
})();
