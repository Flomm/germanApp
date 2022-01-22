import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
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

  it('should emit the expected values and format when word request is submitted', () => {
    //Arrange

    spyOn(component.wordRequest, 'emit');
    component.chooseLanguageForm.setValue({ language: Language.DE });

    //Act
    component.submitWordRequest();

    //Assert
    expect(component.wordRequest.emit).toHaveBeenCalledWith(Language.DE);
  });

  it('should emit the expected values and format when removal request is submitted', () => {
    //Arrange
    spyOn(component.wordRemoval, 'emit');
    component.chooseLanguageForm.setValue({ language: Language.DE });

    //Act
    component.submitRemoval(1);

    //Assert
    expect(component.wordRemoval.emit).toHaveBeenCalledWith({
      language: Language.DE,
      wordId: 1,
    });
  });

  it('should emit the expected values and format when modify request is submitted', () => {
    //Arrange
    spyOn(component.wordModify, 'emit');
    component.chooseLanguageForm.setValue({ language: Language.DE });

    //Act
    component.submitModify('testWord', 1, TopicType.FAMILY);

    //Assert
    expect(component.wordModify.emit).toHaveBeenCalledWith({
      word: 'testWord',
      wordId: 1,
      language: Language.DE,
      topic: TopicType.FAMILY,
      gender: undefined,
    });
  });
});
