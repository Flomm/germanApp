import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MyProfileComponent } from './my-profile.component';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import INewUsernameRequest from 'src/app/shared/models/requests/INewUsernameRequest';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyProfileComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return authService with given value', () => {
    // Arrange
    component.myUserProfileForm.setValue({
      name: 'test',
      email: 'test@test.hu',
    });
    spyOn(component.newUsernameRequest, 'emit');
    const mockNewUsernameRequest: INewUsernameRequest = {
      name: 'test',
    };

    // Act
    component.submitUsernameChange();

    // Assert
    expect(component.newUsernameRequest.emit).toHaveBeenCalledOnceWith(
      mockNewUsernameRequest
    );
  });
});
