import IUpdateTicketDataModel from '../../models/models/dataModels/IUpdateTicketDataModel';
import IAddTicketDataModel from '../../models/models/dataModels/IAddTicketDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import ITicketDomainModel from '../../models/models/domainModels/ITicketDomainModel';
import { ticketRepository } from '../../repository/ticketRepository/ticketRepository';
import {
  notFoundError,
  serverError,
} from '../errorCreatorService/errorCreator.service';
import { ticketService } from './ticketService';

const testTicket: IAddTicketDataModel = {
  type: 1,
  name: 'Test concert',
  price: 100,
  date: new Date('2021-07-26T17:19:25.698Z'),
  cityName: 'Budapest',
  numberOfAllTickets: 100,
};

const expectedTicket: ITicketDomainModel = {
  id: 1,
  type: 1,
  name: 'test',
  price: 100,
  date: new Date('2022-07-30T17:19:25.698Z'),
  cityName: 'Budapest',
  numberOfAllTickets: 10,
};

describe('addTicket', () => {
  test('successfully adding ticket', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    ticketRepository.addTicket = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    await ticketService.addTicket(testTicket);

    //Assert
    expect(ticketRepository.addTicket).toHaveBeenCalledWith(testTicket);
  });

  test('should create servererror if affectedrows is 0', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 0,
    };
    ticketRepository.addTicket = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    try {
      await ticketService.addTicket(testTicket);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('Could not add the ticket'));
      expect(ticketRepository.addTicket).toHaveBeenCalledWith(testTicket);
    }
  });

  test('repository error', async () => {
    //Arrange
    ticketRepository.addTicket = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await ticketService.addTicket(testTicket);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(ticketRepository.addTicket).toHaveBeenCalledWith(testTicket);
    }
  });
});

describe('getTickets', () => {
  test('it should return the tickets for an Admin', async () => {
    //Arrange
    ticketRepository.getTickets = jest.fn().mockResolvedValue(expectedTicket);
    //Act

    let response = await ticketService.getTickets();

    //Assert
    expect(response).toEqual(expectedTicket);
  });

  test('it should return the tickets for a Consumer', async () => {
    //Arrange
    ticketRepository.getFutureTickets = jest.fn().mockResolvedValue(expectedTicket);
    //Act
    const response = await ticketService.getFutureTickets();

    //Assert
    expect(response).toEqual(expectedTicket);
  });

  test('repository error', async () => {
    //Arrange
    ticketRepository.getTickets = jest
      .fn()
      .mockRejectedValue(serverError('error'));

    ticketRepository.getTickets = jest.fn().mockResolvedValue(expectedTicket);
    //Act
    try {
      await ticketService.getTickets;
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('error'));
    }
  });

  describe('updateTicket', () => {
    const modifiedTestTicket: IUpdateTicketDataModel = {
      ticketId: 1,
      type: 1,
      name: 'Test concert',
      price: 100,
      date: new Date('2021-07-26T17:19:25.698Z'),
      cityName: 'Budapest',
      numberOfAllTickets: 100,
    };

    test('successfully updating ticket', async () => {
      //Arrange
      const mockDbResult: IDbResultDataModel = {
        affectedRows: 1,
      };
      ticketRepository.updateTicket = jest.fn().mockResolvedValue(mockDbResult);

      //Act
      await ticketService.updateTicket(modifiedTestTicket);
      //Assert

      expect(ticketRepository.updateTicket).toHaveBeenCalledWith(
        modifiedTestTicket,
      );
    });

    test('should create servererror if affectedrows is 0', async () => {
      //Arrange
      const mockDbResult: IDbResultDataModel = {
        affectedRows: 0,
      };

      ticketRepository.updateTicket = jest.fn().mockResolvedValue(mockDbResult);

      //Act
      try {
        await ticketService.updateTicket(modifiedTestTicket);
      } catch (err) {
        //Assert
        expect(err).toEqual(serverError('Could not update the ticket'));
        expect(ticketRepository.updateTicket).toHaveBeenCalledWith(
          modifiedTestTicket,
        );
      }
    });

    test('repository error', async () => {
      //Arrange
      ticketRepository.updateTicket = jest
        .fn()
        .mockRejectedValue(serverError('test'));

      //Act
      try {
        await ticketService.updateTicket(modifiedTestTicket);
      } catch (err) {
        //Assert
        expect(err).toEqual(serverError('test'));
        expect(ticketRepository.updateTicket).toHaveBeenCalledWith(
          modifiedTestTicket,
        );
      }
    });
  });
});

describe('removeTicket', () => {
  test('successfully remove ticket', async () => {
    //Arrange
    const idRequest = 1;

    ticketRepository.removeTicket = jest.fn().mockResolvedValue(idRequest);

    //Act
    await ticketService.removeTicket(idRequest);

    //Assert
    expect(ticketRepository.removeTicket).toHaveBeenCalledWith(idRequest);
  });

  test('TicketId not found', async () => {
    //Arrange
    const idRequest = 1;
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 0,
    };
    ticketRepository.removeTicket = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    try {
      await ticketService.removeTicket(idRequest);
    } catch (err) {
      //Assert
      expect(ticketRepository.removeTicket).toHaveBeenCalledWith(idRequest);
      expect(err).toEqual(notFoundError('This ticket Id is not found'));
    }
  });

  describe('updateTicket', () => {
    const modifiedTestTicket: IUpdateTicketDataModel = {
      ticketId: 1,
      type: 1,
      name: 'Test concert',
      price: 100,
      date: new Date('2021-07-26T17:19:25.698Z'),
      cityName: 'Budapest',
      numberOfAllTickets: 100,
    };

    test('successfully updating ticket', async () => {
      //Arrange
      const mockDbResult: IDbResultDataModel = {
        affectedRows: 1,
      };
      ticketRepository.updateTicket = jest.fn().mockResolvedValue(mockDbResult);

      //Act
      await ticketService.updateTicket(modifiedTestTicket);
      
      //Assert
      expect(ticketRepository.updateTicket).toHaveBeenCalledWith(
        modifiedTestTicket,
      );
    });

    test('should create servererror if affectedrows is 0', async () => {
      //Arrange
      const mockDbResult: IDbResultDataModel = {
        affectedRows: 0,
      };

      ticketRepository.updateTicket = jest.fn().mockResolvedValue(mockDbResult);

      //Act
      try {
        await ticketService.updateTicket(modifiedTestTicket);
      } catch (err) {
        //Assert
        expect(err).toEqual(serverError('Could not update the ticket'));
        expect(ticketRepository.updateTicket).toHaveBeenCalledWith(
          modifiedTestTicket,
        );
      }
    });

    test('repository error', async () => {
      //Arrange
      ticketRepository.updateTicket = jest
        .fn()
        .mockRejectedValue(serverError('test'));

      //Act
      try {
        await ticketService.updateTicket(modifiedTestTicket);
      } catch (err) {
        //Assert
        expect(err).toEqual(serverError('test'));
        expect(ticketRepository.updateTicket).toHaveBeenCalledWith(
          modifiedTestTicket,
        );
      }
    });
  });
});
