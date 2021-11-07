import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import TicketService from 'src/app/core/services/ticketService/ticket.service';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';

import { ConsumerMyTicketsComponent } from './consumer-my-tickets.component';

describe('ConsumerMyTicketsComponent', () => {
  let component: ConsumerMyTicketsComponent;
  let fixture: ComponentFixture<ConsumerMyTicketsComponent>;
  let ticketServiceSpy: jasmine.SpyObj<TicketService>;

  beforeEach(async () => {
    ticketServiceSpy = jasmine.createSpyObj<TicketService>('ticketService', [
      'getMyTickets',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ConsumerMyTicketsComponent],
      providers: [{ provide: TicketService, useValue: ticketServiceSpy }],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerMyTicketsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMyTickets on initialization and make the getMyTicketsResponse equal to the response', () => {
    //Arrange
    const mockResponse: IGetTicketResponse = { ticketList: [] };
    ticketServiceSpy.getMyTickets.and.returnValue(of(mockResponse));

    //Act
    fixture.detectChanges();

    //Assert
    expect(ticketServiceSpy.getMyTickets).toHaveBeenCalledTimes(1);
    expect(component.getMyTicketsResponse).toEqual(mockResponse);
  });
});
