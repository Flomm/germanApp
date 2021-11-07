import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import TicketService from 'src/app/core/services/ticketService/ticket.service';
import ITicketAddRequest from 'src/app/shared/models/requests/ITicketAddRequest';
import EnumToViewPipe from 'src/app/shared/pipes/enumToView/enumToView.pipe';
import { AddTicketFormComponent } from './add-ticket-form.component';

describe('AddTicketFormComponent', () => {
  let component: AddTicketFormComponent;
  let fixture: ComponentFixture<AddTicketFormComponent>;
  let ticketServiceSpy: jasmine.SpyObj<TicketService>;

  beforeEach(async () => {
    ticketServiceSpy = jasmine.createSpyObj<TicketService>('ticketService', ['addTicket']);
    await TestBed.configureTestingModule({
      declarations: [AddTicketFormComponent, EnumToViewPipe],
      providers: [{provide: TicketService, useValue: ticketServiceSpy}]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should emit the expected values and format when request is submitted', () => {
    //Arrange
    const mockData: ITicketAddRequest = {
      type: 1,
      name: 'Test Concert',
      price: 100,
      date: new Date('2017-06-01T08:30'),
      cityName: 'Budapest',
      numberOfAllTickets: 100,
    };
    component.addTicketForm.setValue(mockData);
    ticketServiceSpy.addTicket.and.returnValue(of());

    //Act
    component.submitNewTicket();

    //Assert
    expect(ticketServiceSpy.addTicket).toHaveBeenCalledWith(mockData);
  });
});
