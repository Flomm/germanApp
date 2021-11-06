import { hashPasswordService } from './hashPassword.service';

const exampleHash: string =
  '$2a$08$BCCUs4xjZTZFPwb8HCRmn.wYhbLldLqVQV/ZBVkJkRGg7xlPZEtoa';

describe('generateHash', () => {
  test('it should return a hash-salt of expected length', () => {
    //Act
    const hashedPassword: string = hashPasswordService.generateHash('flomm123');

    //Assert
    expect(hashedPassword.length).toEqual(exampleHash.length);
  });
});

describe('comparePasswords', () => {
  test('it should be return true with the correct password', () => {
    //Arrange
    const passwordToHash: string = 'flomm123';

    //Act
    const compareResult: boolean = hashPasswordService.comparePasswords(
      passwordToHash,
      exampleHash,
    );

    //Assert
    expect(compareResult).toBe(true);
  });

  test('it should be return false with incorrect password', () => {
    //Arrange
    const passwordToHash: string = 'Flomm123';

    //Act
    const compareResult: boolean = hashPasswordService.comparePasswords(
      passwordToHash,
      exampleHash,
    );

    //Assert
    expect(compareResult).toBe(false);
  });
});
