import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import EnumToViewPipe from 'src/app/shared/pipes/enumToView/enumToView.pipe';
import TranslationPipe from 'src/app/shared/pipes/translationPipe/translation.pipe';
import { AdminModifyWordComponent } from './admin-modify-word.component';

describe('AdminModifyWordComponent', () => {
  let component: AdminModifyWordComponent;
  let fixture: ComponentFixture<AdminModifyWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminModifyWordComponent, EnumToViewPipe, TranslationPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModifyWordComponent);
    component = fixture.componentInstance;
    component.modifyWordData = {
      wordData: {
        word: 'test',
        id: 1,
        topic: TopicType.FAMILY,
        translations: [],
      },
      language: Language.DE,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
