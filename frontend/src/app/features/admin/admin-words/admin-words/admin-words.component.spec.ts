import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WordService } from 'src/app/core/services/wordService/word.service';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';
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
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWordsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllWords on initialization and make the getWordResponse equal to the response', () => {
    //Arrange
    const mockResponse: IGetWordResponse = { wordList: [] };
    wordServiceSpy.getAllWords.and.returnValue(of(mockResponse));

    //Act
    fixture.detectChanges();

    //Assert
    expect(wordServiceSpy.getAllWords).toHaveBeenCalledTimes(1);
    expect(component.getWordResponse).toEqual(mockResponse);
  });
});