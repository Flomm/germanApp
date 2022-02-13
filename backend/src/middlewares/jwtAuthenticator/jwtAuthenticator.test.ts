import { Request, Response, NextFunction } from 'express';
import { unauthorizedError } from '../../services/errorCreatorService/errorCreatorService';
import { jwtService } from '../../services/jwtService/jwtService';
import tokenAuthentication from './jwtAuthenticator';

describe('tokenAuthentication', () => {
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let next: NextFunction;

  beforeEach(() => {
    mockResponse = {};
    next = jest.fn();
  });

  test('it should call next with the unauthorized error if there is no token', () => {
    //Arrange
    mockRequest = {
      headers: {},
    };

    //Act
    tokenAuthentication()(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    //Assert
    expect(next).toBeCalledWith(unauthorizedError('Nincs érvényes token.'));
  });

  test('it should call next with the unauthorized error if the token in the header is invalid', () => {
    //Arrange
    mockRequest = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6TOMI',
      },
    };

    //Act
    tokenAuthentication()(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    //Assert
    expect(next).toBeCalledWith(unauthorizedError('Nincs érvényes token.'));
  });

  test('it should call next if there is a valid token', () => {
    //Arrange
    const mockToken = jwtService.generateAccessToken(
      -1,
      'kiskutya@kiskutya.hu',
      1,
    );
    mockRequest = {
      headers: {
        authorization: `Bearer ${mockToken}`,
      },
    };

    //Act
    tokenAuthentication()(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    //Assert
    expect(next).toBeCalledWith();
  });
});
