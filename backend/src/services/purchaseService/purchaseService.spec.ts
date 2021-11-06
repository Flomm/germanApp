import IAddPurchaseDataModel from '../../models/models/dataModels/IAddPurchaseDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IPurchaseListDataModel from '../../models/models/dataModels/IPurchaseDataModel';
import ITicketDomainModel from '../../models/models/domainModels/ITicketDomainModel';
import { purchaseRepository } from '../../repository/purchaseRepository/purchaseRepository';
import { ticketRepository } from '../../repository/ticketRepository/ticketRepository';
import { codeGeneratorService } from '../codeGeneratorService/codeGenerator.service';
import { serverError } from '../errorCreatorService/errorCreator.service';
import { purchaseService } from './purchaseService';

describe('addPurchase', () => {
  const exampleTicket: ITicketDomainModel = {
    id: 1,
    type: 1,
    name: 'test',
    price: 100,
    date: new Date('2021-07-30T17:19:25.698Z'),
    cityName: 'Budapest',
    numberOfAllTickets: 10,
  };

  const newPurchases: IAddPurchaseDataModel[] = [
    { ticketId: 1, userId: -1, validationCode: 0 },
  ];
  const newPurchasesWithCode: IAddPurchaseDataModel[] = [
    { ticketId: 1, userId: -1, validationCode: 123456 },
  ];

  test('successfully purchase ticket', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    ticketRepository.getTicketById = jest.fn().mockResolvedValue(exampleTicket);
    purchaseRepository.addPurchase = jest.fn().mockResolvedValue(mockDbResult);
    codeGeneratorService.generateSixDigitCode = jest
      .fn()
      .mockReturnValue(123456);

    //Act
    await purchaseService.addPurchase(newPurchases);

    //Assert
    expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
    expect(codeGeneratorService.generateSixDigitCode).toHaveBeenCalledTimes(1);
    expect(purchaseRepository.addPurchase).toHaveBeenCalledWith(
      newPurchasesWithCode,
    );
  });

  test('not found ticket', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    ticketRepository.getTicketById = jest.fn().mockResolvedValue([]);
    purchaseRepository.addPurchase = jest.fn().mockResolvedValue(mockDbResult);
    codeGeneratorService.generateSixDigitCode = jest
      .fn()
      .mockReturnValue(123456);

    //Act
    try {
      await purchaseService.addPurchase(newPurchases);
    } catch (err) {
      //Assert
      expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
      expect(codeGeneratorService.generateSixDigitCode).toHaveBeenCalledTimes(
        1,
      );
      expect(purchaseRepository.addPurchase).not.toHaveBeenCalled();
      expect(err.message).toEqual('Ticket was not found');
      expect(err.status).toEqual(404);
    }
  });

  test('cannot insert to the db', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 0,
    };
    ticketRepository.getTicketById = jest.fn().mockResolvedValue(exampleTicket);
    purchaseRepository.addPurchase = jest.fn().mockResolvedValue(mockDbResult);
    codeGeneratorService.generateSixDigitCode = jest
      .fn()
      .mockReturnValue(123456);

    //Act
    try {
      await purchaseService.addPurchase(newPurchases);
    } catch (err) {
      //Assert
      expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
      expect(codeGeneratorService.generateSixDigitCode).toHaveBeenCalledTimes(
        1,
      );
      expect(purchaseRepository.addPurchase).toHaveBeenCalledWith(
        newPurchasesWithCode,
      );
      expect(err.message).toEqual('Could not add purchase');
      expect(err.status).toEqual(500);
    }
  });

  test('error in repository', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 0,
    };
    ticketRepository.getTicketById = jest.fn().mockResolvedValue(exampleTicket);
    purchaseRepository.addPurchase = jest
      .fn()
      .mockResolvedValue(Promise.reject('test error'));
    codeGeneratorService.generateSixDigitCode = jest
      .fn()
      .mockReturnValue(123456);

    //Act
    try {
      await purchaseService.addPurchase(newPurchases);
    } catch (err) {
      //Assert
      expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
      expect(codeGeneratorService.generateSixDigitCode).toHaveBeenCalledTimes(
        1,
      );
      expect(purchaseRepository.addPurchase).toHaveBeenCalledWith(
        newPurchasesWithCode,
      );
      expect(err).toEqual('test error');
    }
  });

  test('successfully purchase ticket with several items', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 3,
    };
    ticketRepository.getTicketById = jest.fn().mockResolvedValue(exampleTicket);
    purchaseRepository.addPurchase = jest.fn().mockResolvedValue(mockDbResult);
    codeGeneratorService.generateSixDigitCode = jest
      .fn()
      .mockReturnValue(123456);

    //Act
    await purchaseService.addPurchase([
      ...newPurchases,
      ...newPurchases,
      ...newPurchases,
    ]);

    //Assert
    expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
    expect(codeGeneratorService.generateSixDigitCode).toHaveBeenCalledTimes(3);
    expect(purchaseRepository.addPurchase).toHaveBeenCalledWith([
      ...newPurchasesWithCode,
      ...newPurchasesWithCode,
      ...newPurchasesWithCode,
    ]);
  });

  describe('getPurchaselists', () => {
    const testPurchaseList: IPurchaseListDataModel = {
      id: 12,
      type: 11,
      name: 'Cucc',
      price: 500,
      date: new Date('2021-07-30T17:19:25.698Z'),
      cityname: 'Houston',
      validationCode: 69,
    };

    const testUserId: number = 1;

    test('it should return the listing', async () => {
      //Arrange
      purchaseRepository.getMyPurchases = jest
        .fn()
        .mockResolvedValue(testPurchaseList);
      //Act

      let response = await purchaseService.getMyPurchasedTickets(testUserId, false);

      //Assert
      expect(response).toEqual(testPurchaseList);
    });

    test('repository error', async () => {
      //Arrange
      purchaseRepository.getMyPurchases = jest
        .fn()
        .mockRejectedValue(serverError('error'));

      purchaseRepository.getMyPurchases = jest
        .fn()
        .mockResolvedValue(testPurchaseList);
      //Act
      try {
        await purchaseService.getMyPurchasedTickets;
      } catch (err) {
        //Assert
        expect(err).toEqual(serverError('error'));
      }
    });
  });
});
