import { TestBed } from '@angular/core/testing';
import ISmallTicketData from 'src/app/shared/models/models/viewModels/ISmallTicketData.viewModel';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CartService }],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add ticket', () => {
    //Arrange
    service.cartList = [];
    const mockTicket: ISmallTicketData = {
      id: 1,
      type: 1,
      name: 'Test',
      price: 6000,
      count: 6000,
    };
    const nextSpy = spyOn(service.cartSubject, 'next');

    //Act
    service.addTicket(mockTicket);

    //Assert
    expect(service.cartList).toHaveSize(1);
    expect(nextSpy).toHaveBeenCalledWith(service.cartList);
  });

  it('should reset cart', () => {
    //Arrange
    service.cartList = [
      {
        id: 1,
        type: 1,
        name: 'Test',
        price: 6000,
        count: 6000,
      },
      {
        id: 2,
        type: 2,
        name: 'Test2',
        price: 7000,
        count: 7000,
      },
    ];
    const nextSpy = spyOn(service.cartSubject, 'next');

    //Act
    service.resetCart();

    //Assert
    expect(service.cartList.length).toEqual(0);
    expect(nextSpy).toHaveBeenCalledWith(service.cartList);
  });

  it('should remove ticket', () => {
    //Arrange
    service.cartList = [
      {
        id: 1,
        type: 1,
        name: 'Test',
        price: 6000,
        count: 6000,
      },
      {
        id: 2,
        type: 2,
        name: 'Test2',
        price: 7000,
        count: 7000,
      },
    ];

    const newList: ISmallTicketData[] = [
      {
        id: 2,
        type: 2,
        name: 'Test2',
        price: 7000,
        count: 7000,
      },
    ];

    const nextSpy = spyOn(service.cartSubject, 'next');

    //Act
    service.removeTicket(1);

    //Assert
    expect(service.cartList).toEqual(newList);
    expect(nextSpy).toHaveBeenCalledWith(newList);
  });
});
