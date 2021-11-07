import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import AuthService from 'src/app/core/services/authService/auth.service';
import { IVerificationRequest } from 'src/app/shared/models/requests/IVerificationRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import { EmailVerificationPageComponent } from './email-verification-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('EmailVerificationPageComponent', () => {
  let component: EmailVerificationPageComponent;
  let fixture: ComponentFixture<EmailVerificationPageComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockActivatedRoute: object[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        queryParams: of({
          code: '69696969',
          email: 'cica@cica.nz',
        }),
      },
    },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>(['verify']);
    await TestBed.configureTestingModule({
      declarations: [EmailVerificationPageComponent],
      providers: [
        mockActivatedRoute,
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
      ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return authService with given value', () => {
    // Arrange
    const mockVerificationRequest: IVerificationRequest = {
      verificationCode: 69696969,
      email: 'cica@cica.nz',
    };
    const mockCustomResponse: ICustomResponse = { message: 'sziauram' };
    authServiceSpy.verify.and.returnValue(of(mockCustomResponse));

    // Act
    fixture.detectChanges();

    // Assert
    expect(authServiceSpy.verify).toHaveBeenCalledOnceWith(
      mockVerificationRequest
    );
    expect(component.verificationResponse).toEqual(mockCustomResponse);
  });
});
