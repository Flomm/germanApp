import enumValueChecker from './enumValueChecker.helper';

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
    const expectedResult = true;
    // Act
    const result: boolean = enumValueChecker<number>(testNumberEnum, 1);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return true if string is in enum', () => {
    // Arrange
    const expectedResult = true;
    // Act
    const result: boolean = enumValueChecker<string>(testStringEnum, 'test1');
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if number is not a value of the enum', () => {
    // Arrange
    const expectedResult = false;
    // Act
    const result: boolean = enumValueChecker<number>(testNumberEnum, 122);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if string is not a value of the enum', () => {
    // Arrange
    const expectedResult = false;
    // Act
    const result: boolean = enumValueChecker<string>(testNumberEnum, 'test122');
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
