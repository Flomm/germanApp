import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import INewPasswordRequest from 'src/app/shared/models/requests/INewPasswordRequest';
import { NewPasswordFormComponent } from './new-password-form.component';

describe('NewPasswordFormComponent', () => {
  let component: NewPasswordFormComponent;
  let fixture: ComponentFixture<NewPasswordFormComponent>;

  const mockActivatedRoute: object[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        queryParams: of({
          email: 'test@test.hu',
          code: 123654,
        }),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPasswordFormComponent],
      providers: [mockActivatedRoute],
      imports: [RouterTestingModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return authService with given value', () => {
    // Arrange
    component.newPasswordForm.setValue({
      password: 'abc123!',
      confirmedPassword: 'abc123!',
    });
    spyOn(component.newPasswordChangeRequest, 'emit');
    const mockNewPasswordAddingRequest: INewPasswordRequest = {
      email: 'test@test.hu',
      passwordRecoveryCode: 123654,
      password: 'abc123!',
    };

    // Act
    component.submitNewPassword();

    // Assert
    expect(component.newPasswordChangeRequest.emit).toHaveBeenCalledOnceWith(
      mockNewPasswordAddingRequest
    );
  });
});
