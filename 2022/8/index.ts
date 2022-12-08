// https://adventofcode.com/2022/day/8

import { Grid, GridCell } from '../common/Grid'
import { readLine } from '../common/readInput'

class Plot extends Grid<number> {
  private getTreesToEdge (fromRowNumber: number, fromColumnNumber: number, getNextCell: ([rowNumber, columnNumber]: [number, number]) => [rowNumber: number, columnNumber: number]): Array<GridCell<number>> {
    let [rowNumber, columnNumber] = getNextCell([fromRowNumber, fromColumnNumber])

    const treesToEdge: Array<GridCell<number>> = []

    while (this.doesRowExist(rowNumber) && this.doesColumnExist(columnNumber)) {
      treesToEdge.push(this.getItem(rowNumber, columnNumber));
      [rowNumber, columnNumber] = getNextCell([rowNumber, columnNumber])
    }

    return treesToEdge
  }

  public getAllTreesToEdge (fromRowNumber: number, fromColumnNumber: number): { top: Array<GridCell<number>>, bottom: Array<GridCell<number>>, right: Array<GridCell<number>>, left: Array<GridCell<number>> } {
    return {
      top: this.getTreesToEdge(fromRowNumber, fromColumnNumber, ([rowNumber, columnNumber]) => [rowNumber + 1, columnNumber]),
      bottom: this.getTreesToEdge(fromRowNumber, fromColumnNumber, ([rowNumber, columnNumber]) => [rowNumber - 1, columnNumber]),
      right: this.getTreesToEdge(fromRowNumber, fromColumnNumber, ([rowNumber, columnNumber]) => [rowNumber, columnNumber + 1]),
      left: this.getTreesToEdge(fromRowNumber, fromColumnNumber, ([rowNumber, columnNumber]) => [rowNumber, columnNumber - 1])
    }
  }
}

function calculateTreeSeeingScore (rootTreeValue: number, treesToEdge: Array<GridCell<number>>): number {
  let score = 0
  for (const { item } of treesToEdge) {
    score++
    if (rootTreeValue - item <= 0) {
      break
    }
  }

  return score
}

void (async () => {
  const plot = new Plot()

  await readLine(8, (line) => {
    plot.addRow(line.split('').map(s => parseInt(s, 10)))
  })

  let visibleTrees = 0
  let maxViewingDistance = 0

  for (const { item: treeValue, rowNumber, columnNumber } of plot.iterateItemsByRow()) {
    const allTreeEdges = plot.getAllTreesToEdge(rowNumber, columnNumber)

    if (Object.entries(allTreeEdges).some(([,trees]) => trees.filter((t) => t.item >= treeValue).length === 0)) {
      visibleTrees++
    }

    const score = calculateTreeSeeingScore(treeValue, allTreeEdges.top) * calculateTreeSeeingScore(treeValue, allTreeEdges.bottom) * calculateTreeSeeingScore(treeValue, allTreeEdges.left) * calculateTreeSeeingScore(treeValue, allTreeEdges.right)
    if (score > maxViewingDistance) {
      maxViewingDistance = score
    }
  }

  console.log(visibleTrees, maxViewingDistance)
})()
