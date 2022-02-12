import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerWordsComponent } from './consumer-words.component';

describe('ConsumerWordsComponent', () => {
  let component: ConsumerWordsComponent;
  let fixture: ComponentFixture<ConsumerWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumerWordsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
