import { ComponentFixture, TestBed } from '@angular/core/testing';
import IRegistrationRequest from '../../../shared/models/requests/IRegistrationRequest';
import { RegistrationFormComponent } from './registration-form.component';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when request is submitted', () => {
    //Arrange
    const mockData: object = {
      name: 'flomm',
      email: 'flomm@gmail.com',
      password: 'flomm123',
      confirmedPassword: 'flomm123',
    };
    spyOn(component.registrationRequest, 'emit');
    component.registrationForm.setValue(mockData);

    //Act
    component.submitRegistration();

    //Assert
    expect(component.registrationRequest.emit).toHaveBeenCalledWith({
      name: 'flomm',
      email: 'flomm@gmail.com',
      password: 'flomm123',
    } as IRegistrationRequest);
  });
});
