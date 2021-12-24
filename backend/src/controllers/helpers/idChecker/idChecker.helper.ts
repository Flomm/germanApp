export default function idChecker(id: number): boolean {
  if (isNaN(id) || id < 1) {
    return false;
  }
  return true;
}
