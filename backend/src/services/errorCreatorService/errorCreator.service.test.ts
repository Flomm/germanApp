import {
  badRequestError,
  notFoundError,
  serverError,
  unauthorizedError,
  conflictError,
} from './errorCreatorService';
import IApiError from '../../models/IApiError';

describe('errorCreatorService', () => {
  test('it should return the correct error object with 400', () => {
    //Arrange
    const expectedError: IApiError = {
      message: 'Bad request',
      status: 400,
    };

    //Act
    const actualError: IApiError = badRequestError('Bad request');

    //Assert
    expect(expectedError).toStrictEqual(actualError);
  });

  test('it should return the correct error object with 404', () => {
    //Arrange
    const expectedError: IApiError = {
      message: 'Not found',
      status: 404,
    };

    //Act
    const actualError: IApiError = notFoundError('Not found');

    //Assert
    expect(expectedError).toStrictEqual(actualError);
  });

  test('it should return the correct error object with 500', () => {
    //Arrange
    const expectedError: IApiError = {
      message: 'Server error',
      status: 500,
    };

    //Act
    const actualError: IApiError = serverError('Server error');

    //Assert
    expect(expectedError).toStrictEqual(actualError);
  });

  test('it should return the correct error object with 401', () => {
    //Arrange
    const expectedError: IApiError = {
      message: 'Unauthorized request',
      status: 401,
    };

    //Act
    const actualError: IApiError = unauthorizedError('Unauthorized request');

    //Assert
    expect(expectedError).toStrictEqual(actualError);
  });

  test('it should return the correct error object with 409', () => {
    //Arrange
    const expectedError: IApiError = {
      message: 'Conflict error',
      status: 409,
    };

    //Act
    const actualError: IApiError = conflictError('Conflict error');

    //Assert
    expect(expectedError).toStrictEqual(actualError);
  });
});
