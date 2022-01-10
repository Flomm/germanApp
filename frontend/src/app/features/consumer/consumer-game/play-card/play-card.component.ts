import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Gender } from 'src/app/shared/models/enums/Gender.enum';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';

@Component({
  selector: 'app-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.scss'],
})
export class PlayCardComponent implements OnInit, OnChanges {
  @Input() actualWord: IGetWordData;
  @Input() language: Language;

  @Output() nextEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() answerEmitter: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  wordForm: FormArray;
  languageType = Language;
  genderType = Gender;
  isSubmitted: boolean;

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(): void {
    this.isSubmitted = false;
    this.createForm();
  }

  createForm(): void {
    this.wordForm = new FormArray([]);
    for (let i: number = 0; i <= this.actualWord.numOfTranslations - 1; i++) {
      const fg: FormGroup = new FormGroup({
        answer: new FormControl('', i === 0 ? Validators.required : null),
      });
      if (this.language === Language.HU) {
        fg.addControl('gender', new FormControl(''));
      }
      this.wordForm.push(fg);
    }
  }

  emitNext(): void {
    this.wordForm.reset();
    this.nextEmitter.emit(true);
  }

  submitForm(): void {
    this.answerEmitter.emit(this.wordForm.value);
    this.isSubmitted = true;
  }
}
