import { Request, Response, NextFunction } from 'express';
import IApiError from '../../models/IApiError';
import errorHandler from './errorHandler';

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    console.error = jest.fn();
    nextFunction = jest.fn();

    mockRequest = {
      originalUrl: 'localhost',
      method: 'GET',
      ip: '123',
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('it should send response with the correct error given to it', () => {
    //Arrange
    const expectedResponse: IApiError = {
      message: 'Bad request',
      status: 400,
    };

    //Act
    errorHandler(
      expectedResponse,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    //Assert
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toBeCalledWith(expectedResponse.status);
    expect(mockResponse.json).toBeCalledWith({
      message: expectedResponse.message,
    });
  });
});
