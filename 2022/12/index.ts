// https://adventofcode.com/2022/day/12

import { Grid, GridCell } from '../common/Grid';
import { readLine } from '../common/readInput';
import { sortByProperty } from '../common/utils';

const S = 'S'.charCodeAt(0);
const E = 'E'.charCodeAt(0);

interface Location {
  neighbors: Location[]
  value: number
  steps: number | null
  shortestFromLocation: Location | null
};

function resolveLocationValue (location: Location): number {
  if (location.value === S) {
    return 'a'.charCodeAt(0);
  }
  if (location.value === E) {
    return 'z'.charCodeAt(0);
  }
  return location.value;
}

function canStitchLocation (baseLocation: Location, targetLocation: Location): boolean {
  return resolveLocationValue(targetLocation) - resolveLocationValue(baseLocation) <= 1;
}

function stitchLocations (grid: Grid<Location>): void {
  for (const location of grid.iterateItemsByRow()) {
    const cellAbove = grid.getCell(location.rowNumber + 1, location.columnNumber);
    const cellBelow = grid.getCell(location.rowNumber - 1, location.columnNumber);
    const cellLeft = grid.getCell(location.rowNumber, location.columnNumber - 1);
    const cellRight = grid.getCell(location.rowNumber, location.columnNumber + 1);

    if (cellAbove !== null) {
      if (canStitchLocation(location.item, cellAbove.item)) {
        location.item.neighbors.push(cellAbove.item);
      }
    }

    if (cellBelow !== null) {
      if (canStitchLocation(location.item, cellBelow.item)) {
        location.item.neighbors.push(cellBelow.item);
      }
    }

    if (cellLeft !== null) {
      if (canStitchLocation(location.item, cellLeft.item)) {
        location.item.neighbors.push(cellLeft.item);
      }
    }

    if (cellRight !== null) {
      if (canStitchLocation(location.item, cellRight.item)) {
        location.item.neighbors.push(cellRight.item);
      }
    }

    if (location.item.neighbors === undefined) {
      console.log(location.item.neighbors, location.columnNumber, location.rowNumber);
    }
  }
}

function backTrackLocations (l: Location): Location[] {
  const locations: Location[] = [];

  let currentLocation: Location | null = l;

  while (currentLocation !== null) {
    locations.unshift(currentLocation);
    currentLocation = currentLocation.shortestFromLocation;
  }

  return locations;
}

function findMinPath (startingLocation: Location, endingLocation: Location): Location[] {
  const processQueue: Location[] = [startingLocation];
  startingLocation.steps = 0;

  while (processQueue.length > 0) {
    const currentLocation = processQueue.shift();

    if (currentLocation === undefined) {
      throw new Error('nothing to process!');
    }

    if (currentLocation.steps === null) {
      throw new Error(`Location ${currentLocation.value} is expected to be defined`);
    }

    const newNeighborSteps = currentLocation.steps + 1;

    currentLocation.neighbors.forEach((neighbor) => {
      if (neighbor.steps === null || newNeighborSteps < neighbor.steps) {
        neighbor.steps = newNeighborSteps;
        neighbor.shortestFromLocation = currentLocation;
        processQueue.push(neighbor);
      }
    });

    processQueue.sort((a, b) => sortByProperty(a, b, (x) => x.steps));
  }

  if (endingLocation.shortestFromLocation === null) {
    throw new Error('could not find ending location from starting location');
  }

  return backTrackLocations(endingLocation);
}

function resetGrid (grid: Grid<Location>): void {
  for (const cell of grid.iterateItemsByRow()) {
    cell.item.steps = null;
    cell.item.shortestFromLocation = null;
  }
}

void (async () => {
  const grid = new Grid<Location>();
  let startingCell: GridCell<Location> | null = null;
  let endingCell: GridCell<Location> | null = null;
  await readLine(12, (line, lineNumber) => {
    const locations: Location[] = line.split('').map(x => ({ value: x.charCodeAt(0), neighbors: [], steps: null, shortestFromLocation: null }));

    grid.addRow(locations);

    if (locations.find(l => l.value === S) !== undefined) {
      startingCell = grid.getItem(lineNumber, locations.findIndex(l => l.value === S));
    }
    if (locations.find(l => l.value === E) !== undefined) {
      endingCell = grid.getItem(lineNumber, locations.findIndex(l => l.value === E));
    }
  });

  if (startingCell === null || endingCell === null) {
    throw new Error('could not find starting or ending cell');
  }

  stitchLocations(grid);
  const minPath = findMinPath((startingCell as GridCell<Location>).item, (endingCell as GridCell<Location>).item);

  console.log(minPath.length - 1);

  console.log(Math.min(
    ...Array.from(grid.iterateItemsByRow())
      .filter(c => resolveLocationValue(c.item) === 'a'.charCodeAt(0))
      .map(l => {
        resetGrid(grid);
        try {
          return findMinPath(l.item, (endingCell as GridCell<Location>).item).length - 1;
        } catch (err) {
          // console.warn(err);
          return null;
        }
      }
      )
      .filter<number>((x): x is number => x !== null)));
})();
