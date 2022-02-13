import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import EnumToViewPipe from 'src/app/shared/pipes/enumToView/enumToView.pipe';
import IGetWordData from '../../models/viewModels/IGetWordData.viewModel';
import TranslationPipe from '../../pipes/translationPipe/translation.pipe';
import { WordTableComponent } from './word-table.component';

describe('WordTableComponent', () => {
  let component: WordTableComponent;
  let fixture: ComponentFixture<WordTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordTableComponent, EnumToViewPipe, TranslationPipe],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.filteringForm.setValue({
      language: Language.DE,
      topic: [],
      filterText: '',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when removal request is submitted', () => {
    //Arrange
    spyOn(component.wordRemoval, 'emit');

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
    const modifyData: IGetWordData = {
      word: 'test',
      id: 1,
      topic: 1,
    };

    //Act
    component.submitModify(modifyData);

    //Assert
    expect(component.wordModify.emit).toHaveBeenCalledWith({
      language: Language.DE,
      wordData: modifyData,
    });
  });
});
