import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscribeMailComponent } from './subscribe-mail.component';

describe('SubscribeMailComponent', () => {
  let component: SubscribeMailComponent;
  let fixture: ComponentFixture<SubscribeMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscribeMailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit value when mailSubscription is called', () => {
    //Arrange
    spyOn(component.subscribe, 'emit');
    component.subscribeForm.setValue({
      name: 'MessziPapa',
      email: 'messzi@papa.net',
    });

    //Act
    component.mailSubscription();

    //Assert
    expect(component.subscribe.emit).toHaveBeenCalledWith({
      name: 'MessziPapa',
      email: 'messzi@papa.net',
    });
  });
});
