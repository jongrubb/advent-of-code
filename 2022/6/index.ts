// https://adventofcode.com/2022/day/6
// disappointing day - really easy.

import { readLine } from '../common/readInput'
import { unique } from '../common/utils'

void (async () => {
  const mem: string[] = []
  let numChars = 0

  await readLine(6, (line) => {
    const chars = line.split('')

    for (const c of chars) {
      mem.push(c)
      numChars++

      console.log(mem)

      if (mem.length === 14 && unique(mem).length === 14) {
        console.log('part1', numChars)
        break
      }
      if (mem.length === 14) {
        mem.shift()
      }
    }
  })
})()
