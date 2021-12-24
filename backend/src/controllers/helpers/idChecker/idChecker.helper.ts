export default function idChecker(id: number) {
  if (isNaN(id) || id < 1) {
    return false;
  }
  return true;
}
