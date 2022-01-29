import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModifyWordComponent } from './admin-modify-word.component';

describe('AdminModifyWordComponent', () => {
  let component: AdminModifyWordComponent;
  let fixture: ComponentFixture<AdminModifyWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminModifyWordComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModifyWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
