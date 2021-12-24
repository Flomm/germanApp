import idChecker from './idChecker.helper';

describe('idChecker', () => {
  test('return true if id is valid', () => {
    // Arrange
    const expectedResult: boolean = true;

    // Act
    const result: boolean = idChecker(1);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if id is negative', () => {
    // Arrange
    const expectedResult: boolean = false;

    // Act
    const result: boolean = idChecker(-1);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if id is zero', () => {
    // Arrange
    const expectedResult: boolean = false;

    // Act
    const result: boolean = idChecker(0);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if id is not a number', () => {
    // Arrange
    const expectedResult: boolean = false;
    const mockWrongId: number = parseInt('lol');

    // Act
    const result: boolean = idChecker(mockWrongId);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
