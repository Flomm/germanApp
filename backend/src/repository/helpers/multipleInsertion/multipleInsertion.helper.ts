export function generateMultipleInsertQueryQuestionMarks(
  numberOfQuestionMarks: number,
  numberOfItems: number,
): string {
  return `${generateQuestionMarksForOneItem(
    numberOfQuestionMarks,
  )}${`, ${generateQuestionMarksForOneItem(numberOfQuestionMarks)}`.repeat(
    numberOfItems - 1,
  )}`;
}

function generateQuestionMarksForOneItem(
  numberOfQuestionMarks: number,
): string {
  return `(?${',?'.repeat(numberOfQuestionMarks - 1)})`;
}
