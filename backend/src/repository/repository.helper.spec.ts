import { generateMultipleInsertQueryQuestionMarks } from "./repository.helper";

describe('generateMultipleInsertQueryQuestionMarks', () => {
    test('with one question mark and one item', () => {
        // Arrange
        const expectedResult = '(?)'

        // Act
        const result = generateMultipleInsertQueryQuestionMarks(1,1);

        // Assert
        expect(result).toEqual(expectedResult);
    });

    test('with two question mark and two item', () => {
         // Arrange
         const expectedResult = '(?,?), (?,?)'

         // Act
         const result = generateMultipleInsertQueryQuestionMarks(2,2);
 
         // Assert
         expect(result).toEqual(expectedResult);
    });

    test('with three question mark and one item', () => {
        // Arrange
        const expectedResult = '(?,?,?)'

        // Act
        const result = generateMultipleInsertQueryQuestionMarks(3,1);

        // Assert
        expect(result).toEqual(expectedResult);
    });

    test('with one question mark and three item', () => {
        // Arrange
        const expectedResult = '(?), (?), (?)'

        // Act
        const result = generateMultipleInsertQueryQuestionMarks(1,3);

        // Assert
        expect(result).toEqual(expectedResult);
    });
})