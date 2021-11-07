import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthGuard } from './auth.guard';
import { Route, Router } from '@angular/router';
import AuthService from '../authService/auth.service';
import { UserRole } from 'src/app/shared/models/enums/UserRole.enum';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'getUserRole',
    ]);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow admin to enter when UserRole is Admin', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('1');
    const fakeRoute: Route = { data: { roles: [UserRole.Admin] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should allow consumer to enter when UserRole is Consumer', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('2');
    const fakeRoute: Route = { data: { roles: [UserRole.Consumer] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not allow consumer to enter when UserRole is Admin', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('2');
    const fakeRoute: Route = { data: { roles: [UserRole.Admin] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should allow admin to enter when UserRole is All', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('1');
    const fakeRoute: Route = { data: { roles: [UserRole.All] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should allow consumer to enter when UserRole is All', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('2');
    const fakeRoute: Route = { data: { roles: [UserRole.All] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should not allow to enter without role when UserRole is Admin', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('');
    const fakeRoute: Route = { data: { roles: [UserRole.Admin] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should not allow to enter without role when UserRole is Consumer', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('');
    const fakeRoute: Route = { data: { roles: [UserRole.Consumer] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should not allow to enter without role when UserRole is All', () => {
    //Arrange
    authServiceSpy.getUserRole.and.returnValue('');
    const fakeRoute: Route = { data: { roles: [UserRole.All] } };

    //Act
    const result: boolean = guard.canLoad(fakeRoute);

    //Assert
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
