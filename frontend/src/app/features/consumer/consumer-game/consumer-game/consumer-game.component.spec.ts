import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GameService } from 'src/app/core/services/gameService/game.service';

import { ConsumerGameComponent } from './consumer-game.component';

describe('ConsumerGameComponent', () => {
  let component: ConsumerGameComponent;
  let fixture: ComponentFixture<ConsumerGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumerGameComponent],
      providers: [{ provide: GameService }],
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
