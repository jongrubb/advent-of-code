type GetPropFunc<T> = (obj: T) => any;

export function sortByProperty<T> (a: T, b: T, getPropFunc: GetPropFunc<T>): number {
  const aText = getPropFunc(a);
  const bText = getPropFunc(b);
  // eslint-disable-next-line no-nested-ternary
  return aText < bText ? -1 : aText > bText ? 1 : 0;
}

export function unique<T> (arr: T[], getUniqueByFunc?: (obj: T) => unknown): T[] {
  const _defaultFunction: GetPropFunc<T> = o => o;
  const _func = getUniqueByFunc ?? _defaultFunction;
  return arr.filter((value, index) => {
    return arr.findIndex(v => _func(v) === _func(value)) === index;
  });
}

export const wait = async (x: number): Promise<void> => await new Promise((resolve) => setTimeout(resolve, x));
