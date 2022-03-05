import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthFormType } from 'src/app/shared/models/enums/AuthFormType.enum';
import { AuthenticationPageComponent } from './authentication-page.component';

let component: AuthenticationPageComponent;
let fixture: ComponentFixture<AuthenticationPageComponent>;

describe('AuthenticationPageComponent with /registration route', () => {
  const mockActivatedRoute: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of(
          convertToParamMap({
            formType: 'registration',
          }),
        ),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [mockActivatedRoute],
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

  it('should have formType "registration" when route is /registration', async () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.REG);
    });
  });
});

describe('AuthenticationPageComponent with /login route', () => {
  const mockActivatedRoute: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of(
          convertToParamMap({
            formType: 'login',
          }),
        ),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [mockActivatedRoute],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "login" when route is /login', async () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.LOGIN);
    });
  });
});

describe('AuthenticationPageComponent with /password-recovery route', () => {
  const mockActivatedRoute: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of(
          convertToParamMap({
            formType: 'password-recovery',
          }),
        ),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [mockActivatedRoute],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "passwordRecoveryForm" when route is /password-recovery', async () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.RECOVERY);
    });
  });
});

describe('AuthenticationPageComponent with /new-password route', () => {
  const mockActivatedRoute: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of(
          convertToParamMap({
            formType: 'new-password',
          }),
        ),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [mockActivatedRoute],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "newPasswordForm" when route is /new-password', async () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.NEW_PASSWORD);
    });
  });
});

describe('AuthenticationPageComponent with /new-password route', () => {
  const mockActivatedRoute: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of(
          convertToParamMap({
            formType: 'change-password',
          }),
        ),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [mockActivatedRoute],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "change-passoword" when route is /new-password', async () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.CHANGE_PASSWORD);
    });
  });
});

describe('AuthenticationPageComponent with /myprofile route', () => {
  const mockActivatedRoute: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of(
          convertToParamMap({
            formType: 'myprofile',
          }),
        ),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [mockActivatedRoute],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "myprofile" when route is /myprofile', async () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.PROFILE);
    });
  });
});

describe('AuthenticationPageComponent with /verification route', () => {
  const mockActivatedRoute: Record<string, unknown>[] = [
    {
      provide: ActivatedRoute,
      useValue: {
        paramMap: of(
          convertToParamMap({
            formType: 'verify',
          }),
        ),
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [mockActivatedRoute],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPageComponent);
    component = fixture.componentInstance;
  });

  it('should have formType "verify" when route is /verify', async () => {
    //Assert
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.formType).toEqual(AuthFormType.VERIFY);
    });
  });
});
