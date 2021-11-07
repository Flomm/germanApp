import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import TicketService from 'src/app/core/services/ticketService/ticket.service';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';
import { ConsumerTicketPageComponent } from './consumer-ticket-page.component';

describe('ConsumerTicketPageComponent', () => {
  let component: ConsumerTicketPageComponent;
  let fixture: ComponentFixture<ConsumerTicketPageComponent>;
  let ticketServiceSpy: jasmine.SpyObj<TicketService>;

  beforeEach(async () => {
    ticketServiceSpy = jasmine.createSpyObj<TicketService>('ticketService', [
      'getTicket',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ConsumerTicketPageComponent],
      providers: [{ provide: TicketService, useValue: ticketServiceSpy }],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerTicketPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTicket on initialization and make the getTicketResponse equal to the response', () => {
    //Arrange
    const mockResponse: IGetTicketResponse = { ticketList: [] };
    ticketServiceSpy.getTicket.and.returnValue(of(mockResponse));

    //Act
    fixture.detectChanges();

    //Assert
    expect(ticketServiceSpy.getTicket).toHaveBeenCalledTimes(1);
    expect(component.getTicketResponse).toEqual(mockResponse);
  });
});
