export function OrTypeOrm<T>(obj: T, conditions: T): T[] {
  const resultConditions = [];

  Object.entries(obj).forEach(([key, value]) => {
    resultConditions.push({ [key]: value, ...conditions });
  });

  return resultConditions;
}
