import fs from 'fs'
import path from 'path'
import * as readline from 'readline'

function getInputFilePath (dayNumber: number): string {
  return path.resolve(__dirname, `../${dayNumber}/input.txt`)
}

export async function readLine (dayNumber: number, onLineRead: (line: string, lineNumber: number) => void | Promise<void>): Promise<void> {
  const path = getInputFilePath(dayNumber)

  const stream = fs.createReadStream(path)

  const rl = readline.createInterface({ input: stream })
  let lineNumber = 0
  for await (const line of rl) {
    await Promise.resolve(onLineRead(line, lineNumber))
    lineNumber++
  }
}
