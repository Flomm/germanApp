import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsListTableComponent } from './words-list-table.component';

describe('WordsListTableComponent', () => {
  let component: WordsListTableComponent;
  let fixture: ComponentFixture<WordsListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordsListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
