export default function enumValueChecker<T>(
  enumToCheck: object,
  value: T,
): boolean {
  return Object.values(enumToCheck).includes(value);
}
