export default function enumValueChecker<T>(
  enumToCheck: object,
  value: T,
): boolean {
  return (<any>Object).values(enumToCheck).includes(value);
}
