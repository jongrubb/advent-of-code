// https://adventofcode.com/2022/day/3

import { readLine } from '../common/readInput';
import { unique } from '../common/utils';

const lowerCase = 'abcdefghijklmnopqrstuvwxyz';

const lowerCaseMap: Record<string, number> = {};

lowerCase.split('').forEach((c, i) => {
  lowerCaseMap[c] = i + 1;
});

console.log(lowerCaseMap);

function findMatchingChar (lines: string[]): string {
  const allLines = lines.reduce((previousValue, currentValue) => previousValue + currentValue, '');

  const chars = unique(allLines.split(''));

  const [,...restLines] = lines;

  let matchingChar = '';

  for (const char of chars) {
    let allLinesMatch = true;
    for (const l of restLines) {
      if (!l.includes(char)) {
        allLinesMatch = false;
        break;
      }
    }

    if (allLinesMatch) {
      matchingChar = char;
      break;
    }
  }

  if (matchingChar === '') {
    console.warn(lines);
    throw new Error('Could not find matching char!');
  }

  return matchingChar;
}

function getCharValue (c: string): number {
  if (c.match(/[a-z]/) != null) {
    return lowerCaseMap[c];
  } else {
    return lowerCaseMap[c.toLowerCase()] + 26;
  }
}

void (async () => {
  let sum = 0;
  await readLine(3, (line) => {
    const firstHalf = line.substring(0, line.length / 2);
    const secondHalf = line.substring(line.length / 2, line.length);

    const matchingChar = findMatchingChar([firstHalf, secondHalf]);

    sum += getCharValue(matchingChar);
  });

  console.log('part1', sum);
})();

void (async () => {
  let sum = 0;

  let lines: string[] = [];

  await readLine(3, (line, lineNumber) => {
    lines.push(line);
    if ((lineNumber + 1) % 3 === 0) {
      const matchingChar = findMatchingChar(lines);

      sum += getCharValue(matchingChar);

      lines = [];
    }
  });

  console.log('part2', sum);
})();
