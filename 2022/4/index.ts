// https://adventofcode.com/2022/day/4

import { readLine } from '../common/readInput'

class Section {
  private readonly start: number
  private readonly end: number

  constructor (section: string) {
    const [start, end] = section.split('-')

    this.start = parseInt(start, 10)
    this.end = parseInt(end, 10)
  }

  public getStart (): number {
    return this.start
  }

  public getEnd (): number {
    return this.end
  }

  public doesSectionOverlap (section: Section): boolean {
    return (this.getStart() <= section.getStart() && section.getEnd() <= this.getEnd()) ||
    (section.getStart() <= this.getStart() && this.getEnd() <= section.getEnd())
  }

  public doesSectionPartialOverlap (section: Section): boolean {
    return (this.getStart() <= section.getStart() && section.getStart() <= this.getEnd()) ||
    (section.getStart() <= this.getStart() && this.getStart() <= section.getEnd()) ||
    (this.getEnd() <= section.getEnd() && section.getStart() <= this.getEnd()) ||
    (section.getEnd() <= this.getEnd() && this.getStart() <= section.getEnd())
  }
}

void (async () => {
  const pairs: Section[][] = []

  await readLine(4, (line) => {
    const [firstSection, secondSection] = line.split(',')

    pairs.push([new Section(firstSection), new Section(secondSection)])
  })

  let numSectionsOverlapped = 0

  pairs.forEach(([section1, section2]) => {
    if (section1.doesSectionOverlap(section2)) {
      numSectionsOverlapped++
    }
  })

  console.log(numSectionsOverlapped)
})()

void (async () => {
  const pairs: Section[][] = []

  await readLine(4, (line) => {
    const [firstSection, secondSection] = line.split(',')

    pairs.push([new Section(firstSection), new Section(secondSection)])
  })

  let numSectionsOverlapped = 0

  pairs.forEach(([section1, section2]) => {
    if (section1.doesSectionPartialOverlap(section2)) {
      numSectionsOverlapped++
    }
  })

  console.log(numSectionsOverlapped)
})()
