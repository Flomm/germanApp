import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { AdminWordsComponent } from './admin-words.component';

describe('AdminWordsComponent', () => {
  let component: AdminWordsComponent;
  let fixture: ComponentFixture<AdminWordsComponent>;
  let wordServiceSpy: jasmine.SpyObj<WordService>;

  beforeEach(async () => {
    wordServiceSpy = jasmine.createSpyObj<WordService>('wordService', [
      'getAllWords',
    ]);
    await TestBed.configureTestingModule({
      declarations: [AdminWordsComponent],
      providers: [{ provide: WordService, useValue: wordServiceSpy }],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWordsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
