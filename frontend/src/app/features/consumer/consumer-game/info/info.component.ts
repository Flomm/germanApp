import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
})
export class InfoComponent {
  @Input() numOfQuestions: number;
  @Input() index: number;

  @Output() backToMenuEmitter: EventEmitter<void> = new EventEmitter<void>();

  emitBack(): void {
    this.backToMenuEmitter.emit();
  }
}
