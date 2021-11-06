import app from '../../app';
import request from 'supertest';
import { UserRole } from '../../models/models/enums/UserRole.enum';
import { IAddPurchaseRequest } from '../../models/requests/IAddPurchaseRequest';
import { jwtService } from '../../services/jwtService/jwt.service';
import { purchaseService } from '../../services/purchaseService/purchaseService';
import IAddPurchaseDataModel from '../../models/models/dataModels/IAddPurchaseDataModel';
import { serverError } from '../../services/errorCreatorService/errorCreator.service';
import IGetPurchaseListResponse from '../../models/responses/IGetPurchaseListResponse';

describe('POST /purchase', () => {
  const mockToken = jwtService.generateAccessToken(
    -1,
    'kiskutya@kiskutya.hu',
    UserRole.Consumer,
  );

  const testPurchaseRequest: IAddPurchaseRequest = {
    ticketId: 1,
    count: 1,
  };

  const newPurchases: IAddPurchaseDataModel[] = [
    { ticketId: 1, userId: -1, validationCode: 0 },
  ];

  beforeEach(() => {
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);
  });

  test('successfully adding purchases', async () => {
    //Arrange
    purchaseService.addPurchase = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .post('/api/purchase')
      .set({ authorization: `Bearer ${mockToken}` })
      .send(testPurchaseRequest);

    //Assert
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      message: 'Purchases have been successfully added',
    });
    expect(purchaseService.addPurchase).toHaveBeenCalledWith(newPurchases);
  });

  test('error in the service', async () => {
    //Arrange
    purchaseService.addPurchase = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/purchase')
      .set({ authorization: `Bearer ${mockToken}` })
      .send(testPurchaseRequest);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(purchaseService.addPurchase).toHaveBeenCalledWith(newPurchases);
  });
});
describe('GET /purchase', () => {
  const mockToken = jwtService.generateAccessToken(
    -1,
    'kiskutya@kiskutya.hu',
    UserRole.Consumer,
  );

  test('successfully listing purchases for a consumer', async () => {
    const date = new Date();

    const testPurchaseList: IGetPurchaseListResponse = {
      purchaseList: [
        {
          id: 12,
          type: 11,
          name: 'Cucc',
          price: 500,
          date: date,
          cityname: 'Houston',
          validationCode: 69,
        },
      ],
    };

    //Arrange
    purchaseService.getMyPurchasedTickets = jest
      .fn()
      .mockResolvedValue(testPurchaseList.purchaseList);

    //Act
    const response = await request(app)
      .get('/api/purchase')
      .set({ authorization: `Bearer ${mockToken}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body.ticketList[0]).toEqual({
      ...testPurchaseList.purchaseList[0],
      date: date.toISOString(),
    });
  });

  test('error in the listing service', async () => {
    //Arrange
    purchaseService.getMyPurchasedTickets = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/purchase')
      .set({ authorization: `Bearer ${mockToken}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
  });
});
