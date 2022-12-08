// https://adventofcode.com/2022/day/8

import { readLine } from '../common/readInput'

function getCell (plot: number[][], rowNumber: number, columnNumber: number): number | null {
  if (rowNumber < 0 || rowNumber >= plot.length) {
    return null
  }

  const row = plot[rowNumber]

  if (columnNumber < 0 || columnNumber >= row.length) {
    return null
  }

  return row[columnNumber]
}

interface TreeInfo {rowNumber: number, columnNumber: number, value: number | null}

function getAllTreesToEdges (plot: number[][], rowNumber: number, columnNumber: number, nextCell: (rowNumber: number, columnNumber: number) => TreeInfo): number[] {
  const trees: number[] = []

  let treeInfo: TreeInfo = nextCell(rowNumber, columnNumber)

  while (treeInfo?.value !== null) {
    trees.push(treeInfo.value)
    treeInfo = nextCell(treeInfo.rowNumber, treeInfo.columnNumber)
  }

  return trees
}

function calculateTreeSeeingScore (treeValue: number, trees: number[]): number {
  let score = 0
  for (const tree of trees) {
    score++
    if (treeValue - tree <= 0) {
      break
    }
  }

  return score
}

function * plotGenerator (plot: number[][] = []): Generator<{
  value: number
  rowNumber: number
  columnNumber: number
}> {
  for (let i = 0; i < plot.length; i++) {
    const row = plot[i]
    for (let j = 0; j < row.length; j++) {
      yield {
        value: row[j],
        rowNumber: i,
        columnNumber: j
      }
    }
  }
}

void (async () => {
  const plot: number[][] = []

  await readLine(8, (line) => {
    plot.push(line.split('').map(s => parseInt(s, 10)))
  })

  let visibleTrees = 0
  let maxViewingDistance = 0

  for (const { value, rowNumber, columnNumber } of plotGenerator(plot)) {
    const treesAround = [
      getAllTreesToEdges(plot, rowNumber, columnNumber, (r, c) => ({ rowNumber: r, columnNumber: c + 1, value: getCell(plot, r, c + 1) })),
      getAllTreesToEdges(plot, rowNumber, columnNumber, (r, c) => ({ rowNumber: r, columnNumber: c - 1, value: getCell(plot, r, c - 1) })),
      getAllTreesToEdges(plot, rowNumber, columnNumber, (r, c) => ({ rowNumber: r + 1, columnNumber: c, value: getCell(plot, r + 1, c) })),
      getAllTreesToEdges(plot, rowNumber, columnNumber, (r, c) => ({ rowNumber: r - 1, columnNumber: c, value: getCell(plot, r - 1, c) }))
    ]

    if (treesAround.some((trees) => trees.filter((t) => t >= value).length === 0)) {
      visibleTrees++
    }

    const score = calculateTreeSeeingScore(value, treesAround[0]) * calculateTreeSeeingScore(value, treesAround[1]) * calculateTreeSeeingScore(value, treesAround[2]) * calculateTreeSeeingScore(value, treesAround[3])
    if (score > maxViewingDistance) {
      maxViewingDistance = score
    }
  }

  console.log(plot, visibleTrees, maxViewingDistance)
})()
