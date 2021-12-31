import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerStatisticsComponent } from './consumer-statistics.component';

describe('ConsumerStatisticsComponent', () => {
  let component: ConsumerStatisticsComponent;
  let fixture: ComponentFixture<ConsumerStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsumerStatisticsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
