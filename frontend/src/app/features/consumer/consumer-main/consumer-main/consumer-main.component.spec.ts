import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerMainComponent } from './consumer-main.component';

describe('ConsumerMainComponent', () => {
  let component: ConsumerMainComponent;
  let fixture: ComponentFixture<ConsumerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
