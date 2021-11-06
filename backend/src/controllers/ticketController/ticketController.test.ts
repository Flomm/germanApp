import app from '../../app';
import request from 'supertest';
import { ticketService } from '../../services/ticketService/ticketService';
import ITicketAddRequest from '../../models/requests/ITicketAddRequest';
import IAddTicketDataModel from '../../models/models/dataModels/IAddTicketDataModel';
import {
  serverError,
} from '../../services/errorCreatorService/errorCreator.service';
import IUpdateTicketDataModel from '../../models/models/dataModels/IUpdateTicketDataModel';
import ITicketUpdateRequest from '../../models/requests/ITicketUpdateRequest';
import { jwtService } from '../../services/jwtService/jwt.service';
import IGetTicketResponse from '../../models/responses/IGetTicketResponse';

const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas';

const consumerToken: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidmFyZ2EudmFuZGE4OEBnbWFpbC5jb20iLCJyb2xlSWQiOjIsImlhdCI6MTYyODg3NzgyMSwiZXhwIjoxNjI4ODgxNDIxfQ.xo_sbuQgVxuTtBl3nnciZLHQEz-X4D9OYpAbQlDG3sw;';

describe('POST /ticket', () => {
  const testTicket: IAddTicketDataModel = {
    type: 1,
    name: 'Test concert',
    price: 100,
    date: new Date('2021-07-26T17:19:25.698Z'),
    cityName: 'Budapest',
    numberOfAllTickets: 100,
  };

  const addTicketRequest: ITicketAddRequest = testTicket;

  beforeEach(() => {
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);
  });

  test('successfully adding ticket', async () => {
    //Arrange
    ticketService.addTicket = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .post('/api/ticket')
      .set({ authorization: `Bearer ${token}` })
      .send(addTicketRequest);

    //Assert
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      message: 'Ticket has been successfully added',
    });
    expect(ticketService.addTicket).toHaveBeenCalledWith({
      ...testTicket,
      date: '2021-07-26T17:19:25.698Z',
    });
  });

  test('error in the service', async () => {
    //Arrange
    ticketService.addTicket = jest.fn().mockRejectedValue(serverError('test'));
    console.error = jest.fn();
    //Act
    const response = await request(app)
      .post('/api/ticket')
      .set({ authorization: `Bearer ${token}` })
      .send(addTicketRequest);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(ticketService.addTicket).toHaveBeenCalledWith({
      ...testTicket,
      date: '2021-07-26T17:19:25.698Z',
    });
  });
});

describe('PUT /ticket', () => {
  const modifiedTestTicket: IUpdateTicketDataModel = {
    ticketId: 1,
    type: 1,
    name: 'Test concert',
    price: 100,
    date: new Date('2021-07-26T17:19:25.698Z'),
    cityName: 'Budapest',
    numberOfAllTickets: 100,
  };

  const updateTicketRequest: ITicketUpdateRequest = modifiedTestTicket;

  test('successfully updating ticket', async () => {
    //Arrange
    ticketService.updateTicket = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .put('/api/ticket/1')
      .set({ authorization: `Bearer ${token}` })
      .send(updateTicketRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'Ticket has been succesfully updated',
    });
    expect(ticketService.updateTicket).toHaveBeenCalledWith({
      ...modifiedTestTicket,
      ticketId: `${1}`,
      date: '2021-07-26T17:19:25.698Z',
    });
  });

  test('should send back 400 error if params is not an integer', async () => {
    //Arrange
    ticketService.updateTicket = jest.fn().mockResolvedValue(Promise.resolve);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    //Act
    const response = await request(app)
      .put('/api/ticket/fail')
      .set({ authorization: `Bearer ${token}` })
      .send(updateTicketRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Ticket id needs to be a positive integer',
    });
  });

  test('error in the service', async () => {
    //Arrange
    ticketService.updateTicket = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    console.error = jest.fn();
    //Act
    const response = await request(app)
      .put('/api/ticket/1')
      .set({ authorization: `Bearer ${token}` })
      .send(updateTicketRequest);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(ticketService.updateTicket).toHaveBeenCalledWith({
      ...modifiedTestTicket,
      ticketId: `${1}`,
      date: '2021-07-26T17:19:25.698Z',
    });
  });
});

describe('DELETE /ticket', () => {
  const idRequest = '1';

  test('successfully delete ticket', async () => {
    //Arrange
    ticketService.removeTicket = jest.fn().mockResolvedValue(idRequest);

    //Act
    const response = await request(app)
      .delete('/api/ticket/1')
      .set({ authorization: `Bearer ${token}` })
      .send(idRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'Ticket has been removed successfully',
    });
    expect(ticketService.removeTicket).toHaveBeenLastCalledWith(
      parseInt(idRequest),
    );
  });

  test('error in the service', async () => {
    //Arrange
    ticketService.removeTicket = jest
      .fn()
      .mockRejectedValue(serverError('error'));
    console.error = jest.fn();
    //Act
    const response = await request(app)
      .delete('/api/ticket/1')
      .set({ authorization: `Bearer ${token}` })
      .send(idRequest);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'error' });
  });

  describe('GET /ticket', () => {
    const date = new Date();

    const mockTicketList: IGetTicketResponse = {
      ticketList: [
        {
          id: 1,
          type: 1,
          name: 'valami',
          price: 10,
          date: date,
          cityName: 'Budapest',
          numberOfAllTickets: 10,
        },
      ],
    };

    test('successfully return tickets as an Admin', async () => {
      //Arrange
      ticketService.getTickets = jest
        .fn()
        .mockResolvedValue(mockTicketList.ticketList);

      //Act
      const response = await request(app)
        .get('/api/ticket')
        .set({ authorization: `Bearer ${token}` });

      //Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.ticketList[0]).toEqual({
        ...mockTicketList.ticketList[0],
        date: date.toISOString(),
      });
    });

    test('error in the service', async () => {
      //Arrange
      ticketService.getTickets = jest
        .fn()
        .mockRejectedValue(serverError('error'));
      console.error = jest.fn();
      //Act
      const response = await request(app)
        .get('/api/ticket')
        .set({ authorization: `Bearer ${token}` });

      //Assert
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual({ message: 'error' });
    });

    test('successfully return tickets as a Consumer', async () => {
      //Arrange
      ticketService.getFutureTickets = jest
        .fn()
        .mockResolvedValue(mockTicketList.ticketList);
      jwtService.getUserRoleFromToken = jest.fn().mockResolvedValue(2);
      //Act
      const response = await request(app)
        .get('/api/ticket')
        .set({ authorization: `Bearer ${consumerToken}` });

      //Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.ticketList[0]).toEqual({
        ...mockTicketList.ticketList[0],
        date: date.toISOString(),
      });
    });
  });
});
