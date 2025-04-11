export function clean<T>(obj: T): T {
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      (typeof obj[propName] === 'string' && obj[propName].length === 0)
    ) {
      delete obj[propName];
    }
  }
  return obj;
}
