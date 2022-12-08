// https://adventofcode.com/2022/day/7

import { readLine } from '../common/readInput';

class DirItem {
  private _size: number;
  public get size (): number {
    return this._size;
  }

  public set size (value: number) {
    this._size = value;
  }

  private _name: string;
  public get name (): string {
    return this._name;
  }

  public set name (value: string) {
    this._name = value;
  }

  constructor (name: string, size: number) {
    this._name = name;
    this._size = size ?? 0;
  }
}

class Dir extends DirItem {
  private readonly _items: DirItem[] = [];
  public get items (): DirItem[] {
    return this._items;
  }

  private _parent: Dir | null;
  public get parent (): Dir | null {
    return this._parent;
  }

  public set parent (value: Dir | null) {
    this._parent = value;
  }

  constructor (name: string, parent: Dir | null) {
    super(name, 0);
    this._parent = parent;
  }

  public toString (): string {
    return `- ${this.name} (dir, size=${this.size})`;
  }

  protected adjustDirSize (size: number): void {
    let p: Dir | null = this as Dir;
    while (p != null) {
      p.size += size;
      p = p.parent;
    }
  }

  public addItem (item: DirItem): void {
    this.items.push(item);
    this.adjustDirSize(item.size);
  }

  public getDir (name: string): Dir {
    const item = this.items.find(x => x.name === name);

    if (item == null) {
      throw new Error(`Could not find ${name} directory!`);
    }
    if (!(item instanceof Dir)) {
      throw new Error(`${name} is not a directory!`);
    }

    return item;
  }
}

class File extends DirItem {
  public toString (): string {
    return `- ${this.name} (file, size=${this.size})`;
  }
}

function printItems (items: DirItem[], indent = 0): void {
  for (const item of items) {
    if (item instanceof File) {
      console.log(' '.repeat(indent * 2) + item.toString());
    } else if (item instanceof Dir) {
      printDir(item, indent);
    }
  }
}

function printDir (dir: Dir, indent = 0): void {
  console.log(' '.repeat(indent * 2) + dir.toString());
  printItems(dir.items, indent + 1);
}

function * itemsGenerator (dir: Dir): Generator<DirItem> {
  for (const item of dir.items) {
    yield item;
    if (item instanceof Dir) {
      for (const i of itemsGenerator(item)) {
        yield i;
      }
    }
  }
}

void (async () => {
  const root = new Dir('/', null);
  let currentDirectory = root;

  await readLine(7, (line) => {
    if (line.includes('$ cd')) {
      const match = line.match(/^\$ cd (.+)$/);

      if (match == null) {
        throw new Error(`unknown command ${line}`);
      }

      const dir = match[1];

      if (dir === '/') {
        currentDirectory = root;
      } else if (dir === '..') {
        if (currentDirectory.parent === null) {
          throw new Error(`${currentDirectory.toString()}, has no parent`);
        }
        currentDirectory = currentDirectory.parent;
      } else {
        currentDirectory = currentDirectory.getDir(dir);
      }
    } else if (line === '$ ls') {
      // printDir(currentDirectory)
    } else if (line.includes('dir')) {
      const match = line.match(/^dir (.+)$/);

      if (match === null) {
        throw new Error(`unknown command ${line}`);
      }

      currentDirectory.addItem(new Dir(match[1], currentDirectory));
    } else {
      const match = line.match(/^(\d+) (.+)$/);

      if (match === null) {
        throw new Error(`unknown command ${line}`);
      }

      const size = parseInt(match[1], 10);
      const name = match[2];

      currentDirectory.addItem(new File(name, size));
    }
  });

  printDir(root);

  let sum = 0;

  for (const item of itemsGenerator(root)) {
    if (item instanceof Dir && item.size <= 100000) {
      sum += item.size;
    }
  }

  console.log(sum);

  const amountLeftOnDisk = 70000000 - root.size;
  const sizeToFreeUp = 30000000 - amountLeftOnDisk;

  console.log(amountLeftOnDisk, sizeToFreeUp);

  let minSize = null;
  let minDir: Dir | null = null;

  for (const item of itemsGenerator(root)) {
    if (item instanceof Dir && item.size >= sizeToFreeUp) {
      if (minSize === null || item.size < minSize) {
        minSize = item.size;
        minDir = item;
      }
    }
  }

  console.log(minDir?.toString());
})();
