import { jwtService } from './jwtService';
import { Request } from 'express';
import { UserRole } from '../../models/models/Enums/UserRole.enum';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas';

describe('generateAccessToken', () => {
  test('it should return a new token', () => {
    //Arrange
    const numberOfSectionsInToken = 3;

    //Act
    const generateAccessToken: string = jwtService.generateAccessToken(
      1,
      'test@test.com',
      UserRole.Admin,
    );
    const lengthOfGeneratedAccesToken: number =
      generateAccessToken.split('.').length;

    //Assert
    expect(lengthOfGeneratedAccesToken).toEqual(numberOfSectionsInToken);
  });
});

describe('getUserIdFromToken', () => {
  test('it should return the userId of the token', () => {
    //Act
    const userId: number = jwtService.getUserIdFromToken(token);

    //Assert
    expect(userId).toBe(1);
  });
});

describe('getUserRoleFromToken', () => {
  test('it should return the roleId of the user of the token', () => {
    //Act
    const userRole: UserRole = jwtService.getUserIdFromToken(token);

    //Assert
    expect(userRole).toBe(UserRole.Admin);
  });
});

describe('getTokenFromRequest', () => {
  test('it should return a token from a request', () => {
    //Arrange
    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    //Act
    const tokenFromRequest = jwtService.getTokenFromRequest(request);

    //Assert
    expect(tokenFromRequest).toBe(token);
  });

  test('it should return null, if authorization is empty', () => {
    //Arrange
    const request = {
      headers: {},
    } as Request;

    //Act
    const tokenFromRequest = jwtService.getTokenFromRequest(request);

    //Assert
    expect(tokenFromRequest).toBeNull();
  });
});
