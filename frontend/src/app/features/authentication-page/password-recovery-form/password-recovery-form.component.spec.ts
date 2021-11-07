import { ComponentFixture, TestBed } from '@angular/core/testing';
import IPasswordRecoveryRequest from 'src/app/shared/models/requests/IPasswordRecoveryRequest';

import { PasswordRecoveryFormComponent } from './password-recovery-form.component';

describe('PasswordRecoveryFormComponent', () => {
  let component: PasswordRecoveryFormComponent;
  let fixture: ComponentFixture<PasswordRecoveryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordRecoveryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRecoveryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when request is submitted', () => {
    //Arrange
    const mockData: IPasswordRecoveryRequest = {
      email: 'fmirka.fm@gmail.com',
    };
    spyOn(component.passwordRecoveryRequest, 'emit');
    component.passwordRecoveryForm.setValue(mockData);

    //Act
    component.submitPasswordRecovery();

    //Assert
    expect(component.passwordRecoveryRequest.emit).toHaveBeenCalledWith(mockData);
  });
});
