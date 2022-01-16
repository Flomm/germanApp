import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { PlayCardComponent } from './play-card.component';

describe('PlayCardComponent', () => {
  let component: PlayCardComponent;
  let fixture: ComponentFixture<PlayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayCardComponent);
    component = fixture.componentInstance;
    component.actualWord = { id: 1, word: 'test', numOfTranslations: 1 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when next submitted', () => {
    //Arrange
    spyOn(component.nextEmitter, 'emit');

    //Act
    component.emitNext();

    //Assert
    expect(component.nextEmitter.emit).toHaveBeenCalledWith(true);
  });

  it('should emit the expected values and format when word request is submitted', () => {
    //Arrange
    spyOn(component.answerEmitter, 'emit');
    component.wordForm.controls.answerList.setValue([{ answer: 'test' }]);

    //Act
    component.submitForm();

    //Assert
    expect(component.answerEmitter.emit).toHaveBeenCalledWith([
      { answer: 'test' },
    ]);
  });
});
