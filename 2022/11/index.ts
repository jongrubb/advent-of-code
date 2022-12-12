// https://adventofcode.com/2022/day/11

import { readAll } from '../common/readInput';
import { sortByProperty } from '../common/utils';

class Item {
  private _worryLevel: number;

  public get worryLevel (): number {
    return this._worryLevel;
  }

  private set worryLevel (value: number) {
    this._worryLevel = value;
  }

  constructor (worryLevel: number) {
    this._worryLevel = worryLevel;
  }

  public addToWorry (amount: number): void {
    this.worryLevel += amount;
  }

  public multiplyToWorry (amount: number): void {
    this.worryLevel *= amount;
  }

  public postInspection (): void {
    this.worryLevel = Math.floor(this.worryLevel / 3);
  }

  public toString (): string {
    return this.worryLevel.toString();
  }
}

class Monkey {
  private _activity: number = 0;
  public get activity (): number {
    return this._activity;
  }

  private set activity (value: number) {
    this._activity = value;
  }

  private _monkeyNumber: number;
  public get monkeyNumber (): number {
    return this._monkeyNumber;
  }

  public set monkeyNumber (value: number) {
    this._monkeyNumber = value;
  }

  private _items: Item[];
  public get items (): Item[] {
    return this._items;
  }

  private set items (value: Item[]) {
    this._items = value;
  }

  private readonly operation: (item: Item) => void;
  private readonly testDivisibleBy: number;

  private _throwToMonkeyIfTrue?: Monkey | undefined;
  public get throwToMonkeyIfTrue (): Monkey {
    if (this._throwToMonkeyIfTrue == null) {
      throw new Error('throwToMonkeyIfTrue is not set!');
    }
    return this._throwToMonkeyIfTrue;
  }

  public set throwToMonkeyIfTrue (value: Monkey) {
    this._throwToMonkeyIfTrue = value;
  }

  private _throwToMonkeyIfFalse?: Monkey | undefined;
  public get throwToMonkeyIfFalse (): Monkey {
    if (this._throwToMonkeyIfFalse == null) {
      throw new Error('throwToMonkeyIfFalse is not set!');
    }
    return this._throwToMonkeyIfFalse;
  }

  public set throwToMonkeyIfFalse (value: Monkey) {
    this._throwToMonkeyIfFalse = value;
  }

  constructor (monkeyNumber: number, items: Item[], testDivisibleBy: number, operation: (item: Item) => void) {
    this._monkeyNumber = monkeyNumber;
    this._items = items;
    this.testDivisibleBy = testDivisibleBy;
    this.operation = operation;
  }

  public processItems (): void {
    this.items.forEach(item => {
      this.activity++;
      this.operation(item);
      item.postInspection();
      if (item.worryLevel % this.testDivisibleBy === 0) {
        this.throwToMonkeyIfTrue.catch(item);
      } else {
        this.throwToMonkeyIfFalse.catch(item);
      }
    });

    this.items = [];
  }

  public catch (item: Item): void {
    this.items.push(item);
  }

  public toString (): string {
    return `Monkey ${this.monkeyNumber}: ${this.activity}, ${this.items}`;
  }
}

void (async () => {
  const monkeyArr: Monkey[] = [];

  const monkeyTexts = readAll(11).split('\n\n');

  monkeyTexts.forEach((text) => {
    const match = text.match(/Monkey (\d+):\s+Starting items: (.+)\s+Operation: new = old ([*+]) (\d+|old)\s+Test: divisible by (\d+)/);

    if (match === null) {
      throw new Error(`could not interpret text! ${text}`);
    }

    const [,monkeyNumberText, items, operator, operatorValueText, divisibleBy] = match;

    const monkeyNumber: number = parseInt(monkeyNumberText, 10);

    monkeyArr[monkeyNumber] = new Monkey(monkeyNumber, items.split(', ').map((item) => new Item(parseInt(item, 10))), parseInt(divisibleBy, 10), (item) => {
      let operatorValue: number;
      if (operatorValueText === 'old') {
        operatorValue = item.worryLevel;
      } else {
        operatorValue = parseInt(operatorValueText, 10);
      }

      if (operator === '*') {
        item.multiplyToWorry(operatorValue);
      } else if (operator === '+') {
        item.addToWorry(operatorValue);
      } else {
        throw new Error(`could not modify item! ${operator} ${operatorValue}`);
      }
    });
  });

  monkeyTexts.forEach((text) => {
    const match = text.match(/Monkey (\d+):.+\s+If true: throw to monkey (\d+)\s+If false: throw to monkey (\d+)/s);

    if (match === null) {
      throw new Error(`could not interpret text! ${text}`);
    }

    const [,monkeyNumberText, ifTrueMonkeyNumberText, ifFalseMonkeyNumberText] = match;

    const monkeyNumber = parseInt(monkeyNumberText, 10);
    const ifTrueMonkeyNumber = parseInt(ifTrueMonkeyNumberText, 10);
    const ifFalseMonkeyNumber = parseInt(ifFalseMonkeyNumberText, 10);

    if (monkeyArr[monkeyNumber] === undefined) {
      throw new Error(`could not find monkey ${monkeyNumber}`);
    }

    if (monkeyArr[ifTrueMonkeyNumber] === undefined) {
      throw new Error(`could not find monkey ${ifTrueMonkeyNumber}`);
    }

    if (monkeyArr[ifFalseMonkeyNumber] === undefined) {
      throw new Error(`could not find monkey ${ifFalseMonkeyNumber}`);
    }

    monkeyArr[monkeyNumber].throwToMonkeyIfTrue = monkeyArr[ifTrueMonkeyNumber];
    monkeyArr[monkeyNumber].throwToMonkeyIfFalse = monkeyArr[ifFalseMonkeyNumber];
  });

  const trimmedMonkeyArr = monkeyArr.filter(m => m !== undefined);

  const rounds = 20;

  trimmedMonkeyArr.forEach(m => {
    console.log(m.toString());
  });

  for (let i = 0; i < rounds; i++) {
    trimmedMonkeyArr.forEach(m => {
      m.processItems();
    });

    console.log(`round, ${i + 1}`);
    trimmedMonkeyArr.forEach(m => {
      console.log(m.toString());
    });
  }

  trimmedMonkeyArr.sort((a, b) => sortByProperty(b, a, (x) => x.activity));

  console.log(trimmedMonkeyArr[0].activity * trimmedMonkeyArr[1].activity);
})();
