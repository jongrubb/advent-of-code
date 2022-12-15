// https://adventofcode.com/2022/day/15

import { readLine } from '../common/readInput';
import { wait } from '../common/utils';

interface Sensor {
  x: number
  y: number
  distance: number
  beacon: Beacon
}

interface Beacon {
  x: number
  y: number
  sensors: Sensor[]
}

enum PlotType {
  Sensor = 'S',
  Beacon = 'B',
  Signal = '#',
  Nothing = '.'
}

class Map {
  public minX: number = 0;
  public maxX: number = 0;
  public minY: number = 0;
  public maxY: number = 0;

  public plot: Record<number, Record<number, PlotType>> = {};
  public beaconMap: Record<string, Beacon> = {};
  public sensorMap: Record<string, Sensor> = {};

  private compileCoordinateKey (x: number, y: number): string {
    return `${x}|${y}`;
  }

  public getPlotValue (x: number, y: number): PlotType {
    return this.plot[x]?.[y] || PlotType.Nothing;
  }

  private _addToPlot (x: number, y: number, type: PlotType): void {
    const xAxis = this.plot[x] || {};
    xAxis[y] = type;
    this.plot[x] = xAxis;
  }

  public addToPlot (x: number, y: number, type: PlotType): void {
    const currentPlotValue = this.getPlotValue(x, y);

    if (type !== currentPlotValue && [PlotType.Beacon, PlotType.Sensor].includes(currentPlotValue)) {
      throw new Error(`Cannot override current plot value: ${currentPlotValue}`);
    }

    this._addToPlot(x, y, type);

    if (x < this.minX) {
      this.minX = x;
    }
    if (y < this.minY) {
      this.minY = y;
    }

    if (x > this.maxX) {
      this.maxX = x;
    }
    if (y > this.maxY) {
      this.maxY = y;
    }
  }

  public safeAddToPlot (x: number, y: number, type: PlotType): void {
    try {
      this.addToPlot(x, y, type);
    } catch (err) {
      // ignore error;
    }
  }

  private _addSensor (sensor: Sensor): void {
    const key = this.compileCoordinateKey(sensor.x, sensor.y);
    if (this.sensorMap[key]) {
      throw new Error(`There is already a sensor at coordinate ${sensor.x}, ${sensor.y}`);
    }
    this.addToPlot(sensor.x, sensor.y, PlotType.Sensor);
    this.sensorMap[key] = sensor;
  }

  private _addBeacon (beacon: Beacon): void {
    this.addToPlot(beacon.x, beacon.y, PlotType.Beacon);
    this.beaconMap[this.compileCoordinateKey(beacon.x, beacon.y)] = beacon;
  }

  private calculateDistance (x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  public addSensor (sensorCoordinate: { x: number, y: number }, beaconCoordinate: { x: number, y: number }): void {
    const beacon = this.beaconMap[this.compileCoordinateKey(beaconCoordinate.x, beaconCoordinate.y)] || {
      x: beaconCoordinate.x,
      y: beaconCoordinate.y,
      sensors: []
    };

    const sensor: Sensor = {
      x: sensorCoordinate.x,
      y: sensorCoordinate.y,
      distance: this.calculateDistance(sensorCoordinate.x, sensorCoordinate.y, beaconCoordinate.x, beaconCoordinate.y),
      beacon
    };

    beacon.sensors.push(sensor);
    sensor.beacon = beacon;

    this._addSensor(sensor);
    this._addBeacon(beacon);
  }
}

function applySignalLocations (map: Map, sensor: Sensor): void {
  const { x, y } = sensor;

  for (let offset = 0; offset <= sensor.distance; offset++) {
    for (let offset2 = 0; offset2 <= sensor.distance - offset; offset2++) {
      map.safeAddToPlot(x + offset2, y + offset, PlotType.Signal);
      map.safeAddToPlot(x - offset2, y + offset, PlotType.Signal);

      map.safeAddToPlot(x + offset2, y - offset, PlotType.Signal);
      map.safeAddToPlot(x - offset2, y - offset, PlotType.Signal);
    }
  }
}

function addNumberToTopHeader (headerLines: String[][], number: number, minNumber: number, headerLength: number): void {
  const numberString = `${number}`;
  const offset = headerLength - numberString.length;
  for (const [i, digit] of numberString.split('').entries()) {
    headerLines[i + offset][number - minNumber] = digit;
  }
}

function buildLeftHeader (number: number, headerLength: number): string {
  const xString = `${number}`;
  return ' '.repeat(headerLength - xString.length) + xString;
}

// TODO switch this to write to file instead
function printMap (map: Map): void {
  const minXLength = `${map.minX}`.length;
  const maxXLength = `${map.maxX}`.length;
  const minYLength = `${map.minY}`.length;
  const maxYLength = `${map.maxY}`.length;

  const topHeaderLength = Math.max(minXLength, maxXLength);
  const leftHeaderLength = Math.max(minYLength, maxYLength);

  const topHeaderLines = Array(topHeaderLength).fill(null).map(() => Array(map.maxX - map.minX).fill(' '));

  addNumberToTopHeader(topHeaderLines, map.minX, map.minX, topHeaderLength);

  const topHeaderSpacing = 5;

  for (let i = map.minX + (topHeaderSpacing - map.minX % topHeaderSpacing); i < map.maxX + 1; i += 10) {
    addNumberToTopHeader(topHeaderLines, i, map.minX, topHeaderLength);
  }

  addNumberToTopHeader(topHeaderLines, map.maxX, map.minX, topHeaderLength);

  topHeaderLines.forEach(line => console.log(' '.repeat(leftHeaderLength) + ' ' + line.join(' ')));

  for (let y = map.minY; y < map.maxY + 1; y++) {
    const row: PlotType[] = [];
    for (let x = map.minX; x < map.maxX + 1; x++) {
      row.push(map.getPlotValue(x, y));
    }

    console.log(buildLeftHeader(y, leftHeaderLength) + ' ' + row.join(' '));
  }
}

void (async () => {
  const map = new Map();

  await readLine(15, (line) => {
    const match = line.match(/^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/);

    if (match === null) {
      throw new Error(`cannot interpret line: ${line}`);
    }

    map.addSensor({ x: parseInt(match[1]), y: parseInt(match[2]) }, { x: parseInt(match[3]), y: parseInt(match[4]) });
  });

  for (const sensor of Object.values(map.sensorMap)) {
    applySignalLocations(map, sensor);
  }

  printMap(map);

  console.log(Array(map.maxX - map.minX).fill(null).reduce<number>((sum, _, offset) => (sum + (map.getPlotValue(offset + map.minX, 10) === PlotType.Nothing ? 0 : 1)), 0));
})();
