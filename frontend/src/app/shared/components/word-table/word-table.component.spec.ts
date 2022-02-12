import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import EnumToViewPipe from 'src/app/shared/pipes/enumToView/enumToView.pipe';
import { WordTableComponent } from './word-table.component';

describe('WordTableComponent', () => {
  let component: WordTableComponent;
  let fixture: ComponentFixture<WordTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordTableComponent, EnumToViewPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when removal request is submitted', () => {
    //Arrange
    spyOn(component.wordRemoval, 'emit');
    component.filteringForm.setValue({ language: Language.DE });

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
    component.filteringForm.setValue({ language: Language.DE });

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
