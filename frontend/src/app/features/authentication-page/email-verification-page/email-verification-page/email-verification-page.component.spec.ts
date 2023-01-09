import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IVerificationRequest } from 'src/app/shared/models/requests/IVerificationRequest';
import { EmailVerificationPageComponent } from './email-verification-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('EmailVerificationPageComponent', () => {
  let component: EmailVerificationPageComponent;
  let fixture: ComponentFixture<EmailVerificationPageComponent>;

  const mockActivatedRoute: Record<string, unknown>[] = [
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
    await TestBed.configureTestingModule({
      declarations: [EmailVerificationPageComponent],
      providers: [mockActivatedRoute],
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
    spyOn(component.verificationRequest, 'emit');

    // Act
    component.submitVerify(mockVerificationRequest);

    // Assert
    expect(component.verificationRequest.emit).toHaveBeenCalledWith(
      mockVerificationRequest,
    );
  });
});
