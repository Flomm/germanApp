import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import AuthService from 'src/app/core/services/authService/auth.service';
import { AuthFormType } from 'src/app/shared/models/enums/AuthFormType.enum';
import { AuthenticationPageComponent } from './authentication-page.component';

let component: AuthenticationPageComponent;
let fixture: ComponentFixture<AuthenticationPageComponent>;

describe('AuthenticationPageComponent with /registration route', () => {
  const mockedProviderForRegistration: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        parent: {
          snapshot: {
            url: [{ path: 'registration' }],
          },
        },
      },
    },
    {
      provide: AuthService,
      useValue: {},
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [RouterTestingModule],
      providers: mockedProviderForRegistration,
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    //Assert
    expect(component).toBeTruthy();
  });

  it('should have formType "registration" when route is /registration', () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.REG);
    });
  });
});

describe('AuthenticationPageComponent with /login route', () => {
  const mockedProviderForLogin: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        parent: {
          snapshot: {
            url: [{ path: 'login' }],
          },
        },
      },
    },
    {
      provide: AuthService,
      useValue: {},
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [RouterTestingModule],
      providers: mockedProviderForLogin,
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "login" when route is /login', () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.LOGIN);
    });
  });
});

describe('AuthenticationPageComponent with /password-recovery route', () => {
  const mockedProviderForPassworRecovery: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        parent: {
          snapshot: {
            url: [{ path: 'password-recovery' }],
          },
        },
      },
    },
    {
      provide: AuthService,
      useValue: {},
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [RouterTestingModule],
      providers: mockedProviderForPassworRecovery,
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "passwordRecoveryForm" when route is /password-recovery', () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.RECOVERY);
    });
  });
});

describe('AuthenticationPageComponent with /new-password route', () => {
  const mockedProviderForNewPassword: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        parent: {
          snapshot: {
            url: [{ path: 'new-password' }],
          },
        },
      },
    },
    {
      provide: AuthService,
      useValue: {},
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [RouterTestingModule],
      providers: mockedProviderForNewPassword,
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "newPasswordForm" when route is /new-password', () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.NEW_PASSWORD);
    });
  });
});

describe('AuthenticationPageComponent with /new-password route', () => {
  const mockedProviderForNewPassword: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        parent: {
          snapshot: {
            url: [{ path: 'change-password' }],
          },
        },
      },
    },
    {
      provide: AuthService,
      useValue: {},
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [RouterTestingModule],
      providers: mockedProviderForNewPassword,
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "change-passoword" when route is /new-password', () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.CHANGE_PASSWORD);
    });
  });
});

describe('AuthenticationPageComponent with /myprofile route', () => {
  const mockedProviderForMyProfile: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        parent: {
          snapshot: {
            url: [{ path: 'myprofile' }],
          },
        },
      },
    },
    {
      provide: AuthService,
      useValue: {},
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [RouterTestingModule],
      providers: mockedProviderForMyProfile,
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "myprofile" when route is /myprofile', () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.PROFILE);
    });
  });
});
