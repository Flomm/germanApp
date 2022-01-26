import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxSelectAllComponent } from './checkbox-select-all.component';

describe('CheckboxSelectAllComponent', () => {
  let component: CheckboxSelectAllComponent;
  let fixture: ComponentFixture<CheckboxSelectAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxSelectAllComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxSelectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
