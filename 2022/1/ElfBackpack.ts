export class ElfBackpack {
  private calories = 0

  public getCalories (): number {
    return this.calories
  }

  public addCalories (caloricValue: number): void {
    this.calories += caloricValue
  }
}
