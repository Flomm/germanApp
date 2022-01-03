import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGameComponent } from './consumer-game.component';

describe('ConsumerGameComponent', () => {
  let component: ConsumerGameComponent;
  let fixture: ComponentFixture<ConsumerGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumerGameComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
