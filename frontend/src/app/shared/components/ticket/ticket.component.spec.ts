import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import AuthService from 'src/app/core/services/authService/auth.service';
import ISmallTicketData from '../../models/models/viewModels/ISmallTicketData.viewModel';
import ITicketData from '../../models/models/viewModels/ITicketData.viewModel';
import { TicketComponent } from './ticket.component';

describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('authService', [
      'getUserRole',
    ]);
    await TestBed.configureTestingModule({
      declarations: [TicketComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the adding of the ticket to the basket', () => {
    //Arrange
    const mockTicketData: ITicketData = {
      id: 1,
      type: 1,
      name: 'Ballet',
      price: 100,
      date: new Date('2021.12.12'),
      cityName: 'Budapest',
      numberOfRemainingTickets: 10,
      numberOfAllTickets: 10,
    };

    const smaillTicketData: ISmallTicketData = {
      id: 1,
      type: 1,
      name: 'Ballet',
      price: 100,
      count: 1,
    };

    spyOn(component.addTicket, 'emit');
    component.ticketData = mockTicketData;
    component.numberOfTickets = new FormControl(1);

    //Act
    component.addToBasket();

    //Assert
    expect(component.addTicket.emit).toHaveBeenCalledWith(smaillTicketData);
  });
});
