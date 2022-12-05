import React from 'react'
import fsPromise from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { render, Text, useApp } from 'ink'
import { DayInput } from '../ink/DayInput'

async function writeIndex (folderPath: string, day: number): Promise<void> {
  let template = await (await fsPromise.readFile(path.resolve(__dirname, './template.txt'))).toString()
  template = template.replace(/#{dayNumber}/g, day.toString())

  await fsPromise.writeFile(path.resolve(folderPath, './index.ts'), template)
}

async function writeTemplate (year: number, day: number): Promise<void> {
  const folderPath = path.resolve(__dirname, `../../${day}`)

  if (fs.existsSync(folderPath)) {
    throw new Error(`folder, ${folderPath}`)
  }

  await fsPromise.mkdir(folderPath, { recursive: true })

  await writeIndex(folderPath, day)
}

function App ({ onSubmit }: { onSubmit: (day: number) => (void | Promise<void>) }): JSX.Element {
  const app = useApp()

  return <>
    <Text>Write template for a specific day.</Text>
    <DayInput onSubmit={async (day) => {
      await onSubmit(day)
      app.exit()
    }}></DayInput>
  </>
}

void (async () => {
  const { waitUntilExit } = render(<App onSubmit={async (day) => await writeTemplate(2022, day)}></App>)

  await waitUntilExit()
})()
