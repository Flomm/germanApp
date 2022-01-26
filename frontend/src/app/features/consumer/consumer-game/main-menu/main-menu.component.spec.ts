import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import EnumToViewPipe from 'src/app/shared/pipes/enumToView/enumToView.pipe';
import TranslationPipe from 'src/app/shared/pipes/translationPipe/translation.pipe';

import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainMenuComponent, EnumToViewPipe, TranslationPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the expected values and format when request is submitted', () => {
    //Arrange

    spyOn(component.randomWordRequest, 'emit');
    component.mainMenuForm.setValue({
      language: Language.DE,
      quantity: 10,
      topic: TopicType.FAMILY,
    });

    //Act
    component.submitMenuForm();

    //Assert
    expect(component.randomWordRequest.emit).toHaveBeenCalledWith({
      language: Language.DE,
      quantity: 10,
      topic: TopicType.FAMILY,
    });
  });
});
