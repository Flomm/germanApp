import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';

@Component({
  selector: 'app-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.scss'],
})
export class PlayCardComponent implements OnInit {
  @Input() actualWord: IGetWordData;
  @Input() language: Language;

  @Output() randomWordRequest: EventEmitter<IGetRandomWordRequest> =
    new EventEmitter<IGetRandomWordRequest>();
  wordForm: FormGroup = new FormGroup({});

  ngOnInit(): void {}

  createForm(): void {
    this.wordForm = new FormGroup({});
  }

  submitForm(): void {
    this.randomWordRequest.emit(this.wordForm.value);
  }
}
