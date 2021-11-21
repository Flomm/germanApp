import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../models/models/enums/UserRole.enum';
import { forbiddenError } from '../../services/errorCreatorService/errorCreator.service';
import permitChecker from './permitChecker';

describe('permitChecker', () => {
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let next: NextFunction;
  let allowedRoles: UserRole[];

  beforeEach(() => {
    mockResponse = {};
    next = jest.fn();
  });

  test('it should call next with the right error if token is missing', () => {
    //Arrange
    mockRequest = {
      headers: {},
    };
    allowedRoles = [UserRole.All];

    //Act
    permitChecker(allowedRoles)(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    //Assert
    expect(next).toBeCalledWith(forbiddenError('Nincs autorizálva.'));
  });

  test('it should call next without arguments if token is present and allowedRoles is All', () => {
    //Arrange
    mockRequest = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas',
      },
    };
    allowedRoles = [UserRole.All];

    //Act
    permitChecker(allowedRoles)(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    //Assert
    expect(next).toBeCalledWith();
  });

  test('it should call next with the right error if allowedRoles does not contain userRole', () => {
    //Arrange
    mockRequest = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas',
      },
    };
    allowedRoles = [UserRole.Consumer];

    //Act
    permitChecker(allowedRoles)(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    //Assert
    expect(next).toBeCalledWith(forbiddenError('Hozzáférés megtagadva.'));
  });

  test('it should call next without arguments if allowedRoles contains userRole', () => {
    //Arrange
    mockRequest = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas',
      },
    };
    allowedRoles = [UserRole.Admin];

    //Act
    permitChecker(allowedRoles)(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    //Assert
    expect(next).toBeCalledWith();
  });
});
