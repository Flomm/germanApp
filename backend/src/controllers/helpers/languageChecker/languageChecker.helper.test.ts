import { Language } from '../../../models/models/Enums/Language.enum';
import languageChecker from './languageChecker.helper';

describe('languageChecker', () => {
  test('return true if language is DE', () => {
    // Arrange
    const expectedResult: boolean = true;
    // Act
    const result: boolean = languageChecker(Language.DE);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return true if language is HU', () => {
    // Arrange
    const expectedResult: boolean = true;
    // Act
    const result: boolean = languageChecker(Language.HU);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('return false if language is invalid', () => {
    // Arrange
    const expectedResult: boolean = false;
    // Act
    const result: boolean = languageChecker('test');
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
