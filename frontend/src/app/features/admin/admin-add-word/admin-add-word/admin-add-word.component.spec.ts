import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WordService } from 'src/app/core/services/wordService/word.service';
import { Gender } from 'src/app/shared/models/enums/Gender.enum';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IAddWordRequest from 'src/app/shared/models/requests/IAddWordRequest';
import EnumToViewPipe from 'src/app/shared/pipes/enumToView/enumToView.pipe';
import { AdminAddWordComponent } from './admin-add-word.component';

describe('AdminAddWordComponent', () => {
  let component: AdminAddWordComponent;
  let fixture: ComponentFixture<AdminAddWordComponent>;
  let wordServiceSpy: jasmine.SpyObj<WordService>;

  beforeEach(async () => {
    wordServiceSpy = jasmine.createSpyObj<WordService>('wordService', [
      'addNewWord',
    ]);
    await TestBed.configureTestingModule({
      declarations: [AdminAddWordComponent, EnumToViewPipe],
      providers: [{ provide: WordService, useValue: wordServiceSpy }],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the correct method with the correct data if request is submitted', () => {
    //Arrange
    const mockData: object = {
      language: Language.DE,
      word: 'Spiegel',
      gender: Gender.DER,
      translations: [{ translation: 'tükör' }],
    };

    const mockRequest: IAddWordRequest = {
      word: 'Spiegel',
      gender: Gender.DER,
      translations: [{ translation: 'tükör' }],
    };

    component.addWordForm.setValue(mockData);
    wordServiceSpy.addNewWord.and.returnValue(of());

    //Act
    component.submitNewWord();

    //Assert
    expect(wordServiceSpy.addNewWord).toHaveBeenCalledWith(
      Language.DE,
      mockRequest
    );
  });
});
