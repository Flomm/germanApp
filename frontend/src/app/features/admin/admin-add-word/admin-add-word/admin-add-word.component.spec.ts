import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddWordComponent } from './admin-add-word.component';

describe('AdminAddWordComponent', () => {
  let component: AdminAddWordComponent;
  let fixture: ComponentFixture<AdminAddWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
