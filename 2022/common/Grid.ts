export interface GridCell<T> {
  rowNumber: number
  columnNumber: number
  item: T
}

export class Grid<T> {
  private gridByRow: T[][] = [];
  private gridByColumn: T[][] = [];

  public * iterateItemsByRow (): Generator<GridCell<T>> {
    for (const [rowNumber, row] of this.gridByRow.entries()) {
      for (const [columnNumber, item] of row.entries()) {
        yield {
          rowNumber, columnNumber, item
        };
      }
    }
  }

  public * iterateItemsByColumn (): Generator<GridCell<T>> {
    for (const [columnNumber, column] of this.gridByColumn.entries()) {
      for (const [rowNumber, item] of column.entries()) {
        yield {
          rowNumber, columnNumber, item
        };
      }
    }
  }

  public getItem (rowNumber: number, columnNumber: number): GridCell<T> {
    const row = this.getRow(rowNumber);

    if (row[columnNumber] === undefined) {
      throw new Error(`Column ${columnNumber} does not exist in row ${rowNumber}`);
    }

    return {
      rowNumber, columnNumber, item: row[columnNumber]
    };
  }

  public getCell (rowNumber: number, columnNumber: number): GridCell<T> | null {
    try {
      return this.getItem(rowNumber, columnNumber);
    } catch (err) {
      return null;
    }
  }

  private addAdjacentItems (arr: T[][], items: T[]): T[][] {
    const arrClone = [...arr];

    for (const [index, item] of items.entries()) {
      const columnOrRow = arrClone[index] ?? [];
      columnOrRow.push(item);
      arrClone[index] = columnOrRow;
    }

    return arrClone;
  }

  public addRow (row: T[]): this {
    this.gridByRow.push([...row]);
    this.gridByColumn = this.addAdjacentItems(this.gridByColumn, row);

    return this;
  }

  public addColumn (column: T[]): this {
    this.gridByColumn.push([...column]);
    this.gridByRow = this.addAdjacentItems(this.gridByRow, column);

    return this;
  }

  public doesRowExist (rowNumber: number): boolean {
    try {
      this.getRow(rowNumber);
    } catch (err) {
      return false;
    }

    return true;
  }

  public getRow (rowNumber: number): T[] {
    if (this.gridByRow[rowNumber] === undefined) {
      throw new Error(`Row ${rowNumber} does not exist`);
    }

    return this.gridByRow[rowNumber];
  }

  public doesColumnExist (rowNumber: number): boolean {
    try {
      this.getColumn(rowNumber);
    } catch (err) {
      return false;
    }

    return true;
  }

  public getColumn (columnNumber: number): T[] {
    if (this.gridByColumn[columnNumber] === undefined) {
      throw new Error(`Column ${columnNumber} does not exist`);
    }

    return this.gridByRow[columnNumber];
  }
}
