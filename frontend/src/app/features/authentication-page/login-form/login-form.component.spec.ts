import { ComponentFixture, TestBed } from '@angular/core/testing';
import ILoginRequest from '../../../shared/models/requests/ILoginRequest';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when request is submitted', () => {
    //Arrange
    const mockData: ILoginRequest = {
      email: 'flomm@gmail.com',
      password: 'flomm123',
    };
    spyOn(component.loginRequest, 'emit');
    component.loginForm.setValue(mockData);

    //Act
    component.submitLogin();

    //Assert
    expect(component.loginRequest.emit).toHaveBeenCalledWith(mockData);
  });
});
