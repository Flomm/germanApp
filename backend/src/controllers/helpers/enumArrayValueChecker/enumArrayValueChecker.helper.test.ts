import enumArrayValueChecker from './enumArrayValueChecker.helper';

enum testNumberEnum {
  TEST1 = 1,
  TEST2,
  TEST3,
}

enum testStringEnum {
  TEST1 = 'test1',
  TEST2 = 'test2',
  TEST3 = 'test3',
}

describe('enumValueChecker', () => {
  test('return true if number is in enum', () => {
    // Arrange
    const expectedResult: boolean = true;
    // Act
    const result: boolean = enumArrayValueChecker<number>(
      testNumberEnum,
      [1, 2],
    );
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return true if string is in enum', () => {
    // Arrange
    const expectedResult: boolean = true;
    // Act
    const result: boolean = enumArrayValueChecker<string>(testStringEnum, [
      'test1',
      'test2',
    ]);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if number is not a value of the enum', () => {
    // Arrange
    const expectedResult: boolean = false;
    // Act
    const result: boolean = enumArrayValueChecker<number>(
      testNumberEnum,
      [1, 2, 122],
    );
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if string is not a value of the enum', () => {
    // Arrange
    const expectedResult: boolean = false;
    // Act
    const result: boolean = enumArrayValueChecker<string>(testNumberEnum, [
      'test1',
      'test2',
      'test122',
    ]);
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
