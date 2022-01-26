export default function enumArrayValueChecker<T>(
  enumToCheck: object,
  valueArray: T[],
): boolean {
  return valueArray.every(val => {
    return (<any>Object).values(enumToCheck).includes(val);
  });
}
