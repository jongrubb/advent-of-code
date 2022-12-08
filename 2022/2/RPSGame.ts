export enum RPS {
  Rock,
  Paper,
  Scissors
}

export const rpsMap: Record<string, RPS> = {
  A: RPS.Rock,
  B: RPS.Paper,
  C: RPS.Scissors,
  X: RPS.Rock,
  Y: RPS.Paper,
  Z: RPS.Scissors
};

const pointsMap = {
  [RPS.Rock]: 1,
  [RPS.Paper]: 2,
  [RPS.Scissors]: 3
};

export const winMap: Record<RPS, RPS> = {
  [RPS.Rock]: RPS.Paper,
  [RPS.Paper]: RPS.Scissors,
  [RPS.Scissors]: RPS.Rock
};

export const loseMap: Record<RPS, RPS> = {
  [RPS.Rock]: RPS.Scissors,
  [RPS.Paper]: RPS.Rock,
  [RPS.Scissors]: RPS.Paper
};

export class RPSGame {
  protected readonly opponent: RPS;
  protected readonly me: RPS;

  constructor (opponent: RPS, me: RPS) {
    this.opponent = opponent;
    this.me = me;
  }

  public getOpponent (): RPS {
    return this.opponent;
  }

  public getMe (): RPS {
    return this.opponent;
  }

  public didWin (): boolean {
    return winMap[this.opponent] === this.me;
  }

  public isDraw (): boolean {
    return this.opponent === this.me;
  }

  public getScore (): number {
    let score = pointsMap[this.me];

    if (this.didWin()) {
      score += 6;
    } else if (this.isDraw()) {
      score += 3;
    }

    return score;
  }
}
