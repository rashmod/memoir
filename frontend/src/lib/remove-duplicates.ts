export default function removeDuplicates<T>(arr: T[], getId: (item: T) => string) {
  const seen = new Set<string>();

  return arr.filter((item) => {
    const id = getId(item);
    if (seen.has(id)) {
      return false;
    } else {
      seen.add(id);
      return true;
    }
  });
}
