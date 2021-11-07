import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumerTicketComponent } from './consumer-ticket.component';

describe('ConsumerTicketComponent', () => {
  let component: ConsumerTicketComponent;
  let fixture: ComponentFixture<ConsumerTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumerTicketComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerTicketComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
