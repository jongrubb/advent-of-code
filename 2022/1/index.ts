// https://adventofcode.com/2022/day/1

import { readLine } from '../common/readInput';
import { ElfBackpack } from './ElfBackpack';

void (async () => {
  let currentBackpack = new ElfBackpack();
  const backPacks = [currentBackpack];

  await readLine(1, (line) => {
    if (line.trim() !== '') {
      currentBackpack.addCalories(parseInt(line, 10));
    } else {
      currentBackpack = new ElfBackpack();
      backPacks.push(currentBackpack);
    }
  });

  const sortedBackpacks = backPacks.sort((a, b) => b.getCalories() - a.getCalories());

  console.log(sortedBackpacks[0].getCalories(), sortedBackpacks[1].getCalories(), sortedBackpacks[2].getCalories());
  console.log(sortedBackpacks[0].getCalories() + sortedBackpacks[1].getCalories() + sortedBackpacks[2].getCalories());
})();
