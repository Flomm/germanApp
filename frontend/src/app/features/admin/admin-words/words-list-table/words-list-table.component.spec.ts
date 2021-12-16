import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import EnumToViewPipe from 'src/app/shared/pipes/enumToView/enumToView.pipe';
import { WordsListTableComponent } from './words-list-table.component';

describe('WordsListTableComponent', () => {
  let component: WordsListTableComponent;
  let fixture: ComponentFixture<WordsListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordsListTableComponent, EnumToViewPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when request is submitted', () => {
    //Arrange

    spyOn(component.wordRequest, 'emit');
    component.chooseLanguageForm.setValue({ language: Language.DE });

    //Act
    component.submitWordRequest();

    //Assert
    expect(component.wordRequest.emit).toHaveBeenCalledWith(Language.DE);
  });
});
