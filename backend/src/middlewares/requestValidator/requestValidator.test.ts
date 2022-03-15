import { Request, Response, NextFunction } from 'express';
import { RequestPart } from '../../models/models/Enums/RequestPart.enum';
import { badRequestError } from '../../services/errorCreatorService/errorCreatorService';
import { requestValidator } from './requestValidator';

describe('requestValidator', () => {
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    nextFunction = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('bodyValidator should call empty next with ok body', () => {
    //Arrange
    const mockBodyReqs = ['test', 'test_one'];
    const mockRequest: Partial<Request> = {
      originalUrl: 'localhost',
      method: 'GET',
      ip: '123',
      body: {
        test: 'test',
        test_one: 'test1',
      },
    };

    //Act
    requestValidator(mockBodyReqs, RequestPart.BODY)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    //Assert
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  test('bodyValidator should call next with correct error if wrong body', () => {
    //Arrange
    const mockBodyReqs = ['test', 'test_one', 'test_two'];
    const mockRequest: Partial<Request> = {
      originalUrl: 'localhost',
      method: 'GET',
      ip: '123',
      body: {
        test: 'test',
        test_one: 'test1',
      },
    };

    //Act
    requestValidator(mockBodyReqs, RequestPart.BODY)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    //Assert
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(
      badRequestError('Test_two mező megadása kötelező.'),
    );
  });

  test('queryValidator should call empty next with ok body', () => {
    //Arrange
    const mockQueryReqs = ['test', 'test_one'];
    const mockRequest: Partial<Request> = {
      originalUrl: 'localhost',
      method: 'GET',
      ip: '123',
      query: {
        test: 'test',
        test_one: 'test1',
      },
    };

    //Act
    requestValidator(mockQueryReqs, RequestPart.QUERY)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    //Assert
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  test('queryValidator should call next with correct error if wrong queries', () => {
    //Arrange
    const mockQueryReqs = ['test', 'test_one', 'test_two'];
    const mockRequest: Partial<Request> = {
      originalUrl: 'localhost',
      method: 'GET',
      ip: '123',
      query: {
        test: 'test',
        test_one: 'test1',
      },
    };

    //Act
    requestValidator(mockQueryReqs, RequestPart.QUERY)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    //Assert
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(
      badRequestError('Test_two mező megadása kötelező.'),
    );
  });
});
