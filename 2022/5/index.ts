// https://adventofcode.com/2022/day/5

import { readLine } from '../common/readInput'

class Stack {
  private _stacks: string[] = []
  public get stacks (): string[] {
    return this._stacks
  }

  public appendStack (s: string): void {
    this._stacks.push(s)
  }

  public prependStack (s: string): void {
    this._stacks = [s, ...this.stacks]
  }

  public popStack (): string | undefined {
    return this._stacks.pop()
  }

  public appendStacks (arr: string[]): void {
    this._stacks = [...this._stacks, ...arr]
  }

  public popChunk (count: number): string[] {
    const chunk: string[] = []

    for (let i = 0; i < count; i++) {
      const value = this.popStack()
      if (value == null) {
        break
      }

      chunk.push(value)
    }

    return chunk.reverse()
  }
}

function getSourceAndTargetStacks (stacks: Stack[], from: number, to: number): { sourceStack: Stack, targetStack: Stack } {
  return {
    sourceStack: stacks[from - 1],
    targetStack: stacks[to - 1]
  }
}

function moveFromTo (stacks: Stack[], move: number, from: number, to: number): void {
  const { sourceStack, targetStack } = getSourceAndTargetStacks(stacks, from, to)

  for (let i = 0; i < move; i++) {
    const value = sourceStack.popStack()
    if (value != null) {
      targetStack.appendStack(value)
    }
  }
}

function moveChunkFromTo (stacks: Stack[], move: number, from: number, to: number): void {
  const { sourceStack, targetStack } = getSourceAndTargetStacks(stacks, from, to)

  const value = sourceStack.popChunk(move)
  targetStack.appendStacks(value)
}

function printTopStacks (stacks: Stack[]): void {
  console.log(stacks.reduce((s, stack) => s + stack.stacks[stack.stacks.length - 1], ''))
}

void (async () => {
  let stacksPart1: Stack[] = []
  let stacksPart2: Stack[] = []

  let isSetup = true

  await readLine(5, (line) => {
    if (isSetup) {
      const numColumns = (line.length + 1) / 4

      if (stacksPart1.length === 0) {
        stacksPart1 = Array(numColumns).fill(null).map(() => new Stack())
        stacksPart2 = Array(numColumns).fill(null).map(() => new Stack())
      }

      if (line.trim().charAt(0) === '1') {
        isSetup = false
        return
      }

      for (let i = 0; i < numColumns; i++) {
        const columnValue = line.substring(i * 4, i * 4 + 4).replace(/[[\]\s]/g, '')

        if (columnValue !== '') {
          stacksPart1[i].prependStack(columnValue)
          stacksPart2[i].prependStack(columnValue)
        }
      }
    } else if (line.trim() !== '') {
      const match = line.match(/move (\d+) from (\d+) to (\d+)/)

      if (match === null) {
        throw new Error('could not find match')
      }

      const move = parseInt(match[1], 10)
      const from = parseInt(match[2], 10)
      const to = parseInt(match[3], 10)

      moveFromTo(stacksPart1, move, from, to)
      moveChunkFromTo(stacksPart2, move, from, to)
    }
  })

  printTopStacks(stacksPart1)
  printTopStacks(stacksPart2)
})()
