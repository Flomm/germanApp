import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-slot',
  templateUrl: './video-slot.component.html',
  styleUrls: ['./video-slot.component.scss'],
})
export class VideoSlotComponent implements OnInit {
  safeVideoUrl: SafeResourceUrl;

  private readonly videoURL: string =
    'https://www.youtube.com/embed/r_It_X7v-1E?modestbranding=1';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.videoURL
    );
  }
}
