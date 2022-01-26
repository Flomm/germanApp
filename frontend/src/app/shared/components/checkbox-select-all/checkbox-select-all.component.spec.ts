import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

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
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
