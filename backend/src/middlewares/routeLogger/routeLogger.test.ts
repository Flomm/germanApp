import { Request, Response, NextFunction } from 'express';
import routeLogger from './routeLogger';

describe('routeLogger', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    console.log = jest.fn();
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

  test('it should call console.log and next function upon new request', () => {
    //Act
    routeLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    //Assert
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});
