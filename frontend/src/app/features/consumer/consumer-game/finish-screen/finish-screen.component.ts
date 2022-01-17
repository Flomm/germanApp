import { Component, Output, EventEmitter, Input } from '@angular/core';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';

@Component({
  selector: 'app-finish-screen',
  templateUrl: './finish-screen.component.html',
  styleUrls: ['./finish-screen.component.scss'],
})
export class FinishScreenComponent {
  @Input() resultString: string;
  @Input() incorrectWords: IGetWordData[] = [];

  @Output() decisionEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  emitDecisionSignal(resetOrReplay: boolean): void {
    this.decisionEmitter.emit(resetOrReplay);
  }
}
