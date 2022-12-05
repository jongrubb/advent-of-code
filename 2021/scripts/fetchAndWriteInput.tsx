import React from 'react'
import { session } from '../credentials'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import { render, Text, useApp } from 'ink'
import { DayInput } from './ink/DayInput'

async function fetchAndWriteInput (year: number, day: number): Promise<void> {
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, { headers: { Cookie: `session=${session}`, 'User-Agent': 'https://github.com/jongrubb/advent-of-code' } })
  const input = (await (await response.blob()).text()).trim()

  await fs.mkdir(path.resolve(__dirname, `../${day}`), { recursive: true })

  await fs.writeFile(path.resolve(__dirname, `../${day}/input.txt`), input, {})
}

function App ({ onSubmit }: { onSubmit: (day: number) => (void | Promise<void>) }): JSX.Element {
  const app = useApp()

  return <>
    <Text>Fetch input for a specific day.</Text>
    <DayInput onSubmit={async (day) => {
      await onSubmit(day)
      app.exit()
    }}></DayInput>
  </>
}

void (async () => {
  const { waitUntilExit } = render(<App onSubmit={async (day) => await fetchAndWriteInput(2021, day)}></App>)

  await waitUntilExit()
})()
