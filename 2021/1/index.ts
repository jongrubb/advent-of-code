// https://adventofcode.com/2021/day/1
import { readLine } from '../common/readInput'

void (async () => {
  let currentMeasurement: number = 0
  let previousMeasurement: number

  let numIncreases = 0

  await readLine(1, (line) => {
    currentMeasurement = parseInt(line, 10)

    if (previousMeasurement === undefined && currentMeasurement > previousMeasurement) {
      numIncreases++
    }

    previousMeasurement = currentMeasurement
  })

  console.log(numIncreases)
})()

void (async () => {
  const measurements: number[] = []
  const sums: number[] = []

  await readLine(1, (line, lineNumber) => {
    measurements.push(parseInt(line, 10))
  })

  for (let i = 0; i < 3; i++) {
    for (let j = i; j < measurements.length; j += 3) {
      sums[j] = measurements[j] + measurements[j + 1] + measurements[j + 2]
    }
  }

  let numIncreases = 0

  for (let i = 0; i + 1 < sums.length; i++) {
    const currentMeasurement = sums[i]
    const nextMeasurement = sums[i + 1]

    if (currentMeasurement < nextMeasurement) {
      numIncreases++
    }
  }

  console.log('part2', numIncreases)
})()
