import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/services/userService/user.service';
import IGetUserResponse from 'src/app/shared/models/responses/IGetUserResponse';
import { AdminUsersComponent } from './admin-users.component';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj<UserService>('userService', [
      'getAllUsers',
    ]);
    await TestBed.configureTestingModule({
      declarations: [AdminUsersComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsers on initialization and make the getUserResponse equal to the response', () => {
    //Arrange
    const mockResponse: IGetUserResponse = { userList: [] };
    userServiceSpy.getAllUsers.and.returnValue(of(mockResponse));

    //Act
    fixture.detectChanges();

    //Assert
    expect(userServiceSpy.getAllUsers).toHaveBeenCalledTimes(1);
    expect(component.getUserResponse).toEqual(mockResponse);
  });
});
