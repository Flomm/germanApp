import { ComponentFixture, TestBed } from '@angular/core/testing';
import IChangePasswordRequest from 'src/app/shared/models/requests/IChangePasswordRequest';

import { ChangePasswordFormComponent } from './change-password-form.component';

describe('ChangePasswordFormComponent', () => {
  let component: ChangePasswordFormComponent;
  let fixture: ComponentFixture<ChangePasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when request is submitted', () => {
    //Arrange
    const mockChangePasswordData: IChangePasswordRequest = {
      newPassword: 'test1',
      oldPassword: 'test2',
    };
    spyOn(component.changePasswordRequest, 'emit');
    component.changePasswordForm.setValue({
      ...mockChangePasswordData,
      confirmedNewPassword: 'test1',
    });

    //Act
    component.submitChangePassword();

    //Assert
    expect(component.changePasswordRequest.emit).toHaveBeenCalledWith(
      mockChangePasswordData,
    );
  });
});
