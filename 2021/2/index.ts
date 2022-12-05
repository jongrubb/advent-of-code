// https://adventofcode.com/2021/day/2

import { readLine } from '../common/readInput'

class Submarine {
  private _x: number = 0
  public get x (): number {
    return this._x
  }

  private _y: number = 0
  public get y (): number {
    return this._y
  }

  private _aim: number = 0
  public get aim (): number {
    return this._aim
  }

  public goForward (d: number): void {
    this._x += d
    this._y += this._aim * d
  }

  public goUp (d: number): void {
    // this._y -= d
    this._aim -= d
    // if (this._y < 0) {
    //   this._y = 0
    // }
    if (this._aim < 0) {
      this._aim = 0
    }
  }

  public goDown (d: number): void {
    // this._y += d
    this._aim += d
  }
}

void (async () => {
  const sub = new Submarine()

  await readLine(2, (line) => {
    const [direction, units] = line.split(' ')

    const d = parseInt(units, 10)

    if (direction === 'forward') {
      sub.goForward(d)
    }
    if (direction === 'up') {
      sub.goUp(d)
    }
    if (direction === 'down') {
      sub.goDown(d)
    }
  })

  console.log(sub.x * sub.y)
})()
