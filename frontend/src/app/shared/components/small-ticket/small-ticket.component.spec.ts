import { ComponentFixture, TestBed } from '@angular/core/testing';
import ISmallTicketData from '../../models/models/viewModels/ISmallTicketData.viewModel';
import { SmallTicketComponent } from './small-ticket.component';

describe('SmallTicketComponent', () => {
  let component: SmallTicketComponent;
  let fixture: ComponentFixture<SmallTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallTicketComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallTicketComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the deletion of the ticket', () => {
    //Arrange
    const mockSmallTicketData: ISmallTicketData = {
      id: 1,
      type: 1,
      name: 'Test',
      price: 6000,
      count: 6000,
    };
    spyOn(component.removeTicket, 'emit');
    component.smallTicketData = mockSmallTicketData;

    //Act
    component.deleteTicket();

    //Assert
    expect(component.removeTicket.emit).toHaveBeenCalledWith(
      mockSmallTicketData
    );
  });
});
