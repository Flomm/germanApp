export default function enumArrayValueChecker<T>(
  enumToCheck: object,
  valueArray: T[],
): boolean {
  return valueArray.every(val => {
    return Object.values(enumToCheck).includes(val);
  });
}
