import { codeGeneratorService } from './codeGeneratorService';

describe('codeGeneratorService', () => {
  test('it should return a six number digit', () => {
    //Act
    const newCode: number = codeGeneratorService.generateSixDigitCode();

    //Assert
    expect((Math.log(newCode) * Math.LOG10E + 1) | 0).toStrictEqual(6);
  });
});
