import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSlotComponent } from './video-slot.component';

describe('VideoSlotComponent', () => {
  let component: VideoSlotComponent;
  let fixture: ComponentFixture<VideoSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoSlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
