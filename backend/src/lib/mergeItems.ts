export default function mergeItems<T>(
  existingItems: T[][],
  newItems: T[][],
  getId: (arg: T) => string,
) {
  const itemMap = new Map<string, T>();

  for (const items of existingItems) {
    for (const item of items) {
      itemMap.set(getId(item), item);
    }
  }

  for (const items of newItems) {
    for (const item of items) {
      itemMap.set(getId(item), item);
    }
  }

  return itemMap;
}
