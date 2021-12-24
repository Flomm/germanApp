export default function idChecker(id: number): boolean {
  return !(isNaN(id) || id < 1);
}
