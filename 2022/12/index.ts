// https://adventofcode.com/2022/day/12

import { fail } from 'assert';
import { Grid, GridCell } from '../common/Grid';
import { readLine } from '../common/readInput';

const S = 'S'.charCodeAt(0);
const E = 'E'.charCodeAt(0);

function getCell (grid: Grid<number>, rowNumber: number, columnNumber: number): GridCell<number> | null {
  try {
    return grid.getItem(rowNumber, columnNumber);
  } catch (err) {
    return null;
  }
}

function resolveCellValue (cell: GridCell<number>): number {
  if (cell.item === S) {
    return 'a'.charCodeAt(0);
  }
  if (cell.item === E) {
    return 'z'.charCodeAt(0);
  }
  return cell.item;
}

function compileVisitedMapKey (cell: GridCell<number>): string {
  return `${cell.rowNumber}|${cell.columnNumber}`;
}

function canProgressToCell (currentCell: GridCell<number>, targetCell: GridCell<number> | null, visitedMap: Record<string, boolean>, failedCellMap: Record<string, boolean>): boolean {
  if (targetCell === null) {
    return false;
  }

  const currentCellValue = resolveCellValue(currentCell);
  const targetCellValue = resolveCellValue(targetCell);

  return !visitedMap[compileVisitedMapKey(targetCell)] && !failedCellMap[compileVisitedMapKey(targetCell)] && targetCellValue - currentCellValue <= 1;
}

function findMinPath (paths: Array<Array<GridCell<number>>>): Array<GridCell<number>> {
  const minPathLength = Math.min(...paths.map(p => p.length));

  return paths.find(p => p.length === minPathLength) ?? [];
}

function findEndingCell (grid: Grid<number>, currentCell: GridCell<number>, currentPath: Array<GridCell<number>>, visitedMap: Record<string, boolean>, failedCellMap: Record<string, boolean>, minPathFound = 0): Array<Array<GridCell<number>>> {
  if (currentCell.item === E) {
    return [[...currentPath]];
  }

  if (minPathFound !== 0 && currentPath.length >= minPathFound) {
    return [];
  }

  const cellAbove = getCell(grid, currentCell.rowNumber + 1, currentCell.columnNumber);
  const cellBelow = getCell(grid, currentCell.rowNumber - 1, currentCell.columnNumber);
  const cellLeft = getCell(grid, currentCell.rowNumber, currentCell.columnNumber - 1);
  const cellRight = getCell(grid, currentCell.rowNumber, currentCell.columnNumber + 1);

  let foundPaths: Array<Array<GridCell<number>>> = [];
  const currentMinPath = minPathFound;

  if (canProgressToCell(currentCell, cellRight, visitedMap, failedCellMap) && cellRight !== null) {
    const newFoundPaths = findEndingCell(grid, cellRight, [...currentPath, cellRight], { ...visitedMap, [compileVisitedMapKey(cellRight)]: true }, failedCellMap, currentMinPath);
    if (newFoundPaths.length > 0) {
      foundPaths.push(...newFoundPaths);
      const minPath = findMinPath(foundPaths);
      foundPaths = [minPath];
    }
  }
  if (canProgressToCell(currentCell, cellAbove, visitedMap, failedCellMap) && cellAbove !== null) {
    const newFoundPaths = findEndingCell(grid, cellAbove, [...currentPath, cellAbove], { ...visitedMap, [compileVisitedMapKey(cellAbove)]: true }, failedCellMap, currentMinPath);
    if (newFoundPaths.length > 0) {
      foundPaths.push(...newFoundPaths);
      const minPath = findMinPath(foundPaths);
      foundPaths = [minPath];
    }
  }
  if (canProgressToCell(currentCell, cellBelow, visitedMap, failedCellMap) && cellBelow !== null) {
    const newFoundPaths = findEndingCell(grid, cellBelow, [...currentPath, cellBelow], { ...visitedMap, [compileVisitedMapKey(cellBelow)]: true }, failedCellMap, currentMinPath);
    if (newFoundPaths.length > 0) {
      foundPaths.push(...newFoundPaths);
      const minPath = findMinPath(foundPaths);
      foundPaths = [minPath];
    }
  }
  if (canProgressToCell(currentCell, cellLeft, visitedMap, failedCellMap) && cellLeft !== null) {
    const newFoundPaths = findEndingCell(grid, cellLeft, [...currentPath, cellLeft], { ...visitedMap, [compileVisitedMapKey(cellLeft)]: true }, failedCellMap, currentMinPath);
    if (newFoundPaths.length > 0) {
      foundPaths.push(...newFoundPaths);
      const minPath = findMinPath(foundPaths);
      foundPaths = [minPath];
    }
  }

  if (foundPaths.length === 0) {
    failedCellMap[compileVisitedMapKey(currentCell)] = true;
  }

  return foundPaths;
}

void (async () => {
  const grid = new Grid<number>();
  let startingCell: GridCell<number> | null = null;
  let endingCell: GridCell<number> | null = null;
  await readLine(12, (line, lineNumber) => {
    const locations = line.split('').map(x => x.charCodeAt(0));

    grid.addRow(locations);

    if (locations.includes(S)) {
      startingCell = grid.getItem(lineNumber, locations.indexOf(S));
      console.log(startingCell, String.fromCharCode(startingCell.item));
    }
    if (locations.includes(E)) {
      endingCell = grid.getItem(lineNumber, locations.indexOf(E));
      console.log(endingCell, String.fromCharCode(endingCell.item));
    }
  });

  if (startingCell === null || endingCell === null) {
    throw new Error('could not find starting or ending cell');
  }

  const paths = findEndingCell(grid, startingCell, [], { [compileVisitedMapKey(startingCell)]: true }, {});

  console.log('total paths found', paths.length);

  const minPath = findMinPath(paths);

  minPath?.forEach(p => {
    console.log(p.columnNumber, p.rowNumber, String.fromCharCode(p.item));
  });

  console.log(minPath.length);
})();
