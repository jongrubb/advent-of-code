/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// https://adventofcode.com/2022/day/14

import { readLine } from '../common/readInput';

enum Element {
  Rock = '#',
  Sand = 'o',
  Air = '.'
}

interface GridCell<T> {
  x: number
  y: number
  value: T
};

class Grid2<T> {
  public readonly grid: T[][] = [];
  public maxX: number = 0;
  public maxY: number = 0;

  public * iterateItemsByRow (): Generator<GridCell<T>> {
    for (const [x, col] of this.grid.entries()) {
      for (const [y, value] of col.entries()) {
        yield {
          x, y, value
        };
      }
    }
  }

  private setMaxX (x: number): void {
    if (this.maxX < x) {
      this.maxX = x;
    }
  }

  private setMaxY (y: number): void {
    if (this.maxY < y) {
      this.maxY = y;
    }
  }

  public setCell (x: number, y: number, value: T): void {
    const row = this.grid[y] ?? [];
    row[x] = value;

    this.grid[y] = row;

    this.setMaxX(x);
    this.setMaxY(y);
  };

  public getCell (x: number, y: number): GridCell<T | null> {
    const value = this.grid[y]?.[x] || null;
    return {
      x, y, value: value ?? null
    };
  }

  public fillEmpty (value: T): void {
    for (let i = 0; i < this.maxY + 1; i++) {
      const yArr = this.grid[i] ?? [];
      for (let j = 0; j < this.maxX + 1; j++) {
        if (yArr[j] === null || yArr[j] === undefined) {
          yArr[j] = value;
        }
      }

      this.grid[i] = yArr;
    }
  };

  public printSection (x: number, y: number): void {
    for (const row of this.grid) {
      console.log(JSON.stringify(row.slice(x, y)));
    }
  }
}

function simulateSandFalling (grid: Grid2<Element>): boolean {
  let x = 500;
  let y = 0;

  while (y < grid.maxY + 1) {
    if (grid.getCell(x, y + 1).value === null) {
      return false;
    }

    if (grid.getCell(x, y + 1).value === Element.Air) {
      y++;
      continue;
    }

    // encountered sand or rock
    if (grid.getCell(x - 1, y + 1).value === Element.Air) {
      x--;
      y++;
      continue;
    }

    if (grid.getCell(x + 1, y + 1).value === Element.Air) {
      x++;
      y++;
      continue;
    }

    grid.setCell(x, y, Element.Sand);
    return true;
  }

  return false;
}

void (async () => {
  const grid = new Grid2<Element>();

  await readLine(14, (line) => {
    const coordinates = line.split(' -> ');

    for (let i = 0; i < coordinates.length - 1; i++) {
      const c1 = coordinates[i].split(',');
      const c2 = coordinates[i + 1].split(',');

      const c1x = parseInt(c1[0], 10);
      const c1y = parseInt(c1[1], 10);
      const c2x = parseInt(c2[0], 10);
      const c2y = parseInt(c2[1], 10);

      if (c1x - c2x !== 0) {
        for (let j = c1x - c2x; c1x - c2x < 0 ? j !== 1 : j !== -1; c1x - c2x < 0 ? j++ : j--) {
          grid.setCell(c2x + j, c1y, Element.Rock);
        }
      }

      if (c1y - c2y !== 0) {
        for (let j = c1y - c2y; c1y - c2y < 0 ? j !== 1 : j !== -1; c1y - c2y < 0 ? j++ : j--) {
          grid.setCell(c1x, c2y + j, Element.Rock);
        }
      }

      if (c1x - c2x === 0 && c1y - c2y === 0) {
        grid.setCell(c1x, c1y, Element.Rock);
      }
    }
  });

  grid.fillEmpty(Element.Air);

  let numSand = 0;

  while (simulateSandFalling(grid)) {
    numSand++;
  }

  console.log('part1', numSand);
})();

void (async () => {
  const grid = new Grid2<Element>();

  await readLine(14, (line) => {
    const coordinates = line.split(' -> ');

    for (let i = 0; i < coordinates.length - 1; i++) {
      const c1 = coordinates[i].split(',');
      const c2 = coordinates[i + 1].split(',');

      const c1x = parseInt(c1[0], 10);
      const c1y = parseInt(c1[1], 10);
      const c2x = parseInt(c2[0], 10);
      const c2y = parseInt(c2[1], 10);

      if (c1x - c2x !== 0) {
        for (let j = c1x - c2x; c1x - c2x < 0 ? j !== 1 : j !== -1; c1x - c2x < 0 ? j++ : j--) {
          grid.setCell(c2x + j, c1y, Element.Rock);
        }
      }

      if (c1y - c2y !== 0) {
        for (let j = c1y - c2y; c1y - c2y < 0 ? j !== 1 : j !== -1; c1y - c2y < 0 ? j++ : j--) {
          grid.setCell(c1x, c2y + j, Element.Rock);
        }
      }

      if (c1x - c2x === 0 && c1y - c2y === 0) {
        grid.setCell(c1x, c1y, Element.Rock);
      }
    }
  });

  const maxX = grid.maxX;
  const maxY = grid.maxY + 2;

  for (let x = 0; x < maxX * 2; x++) {
    grid.setCell(x, maxY, Element.Rock);
  }

  grid.fillEmpty(Element.Air);

  let numSand = 0;

  while (simulateSandFalling(grid)) {
    numSand++;
    if (grid.getCell(500, 0).value === Element.Sand) {
      break;
    }
  }

  console.log('part2', numSand);
})();
