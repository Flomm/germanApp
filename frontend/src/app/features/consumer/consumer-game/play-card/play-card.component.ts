import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Gender } from 'src/app/shared/models/enums/Gender.enum';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IAnswer from 'src/app/shared/models/viewModels/IAnswer.viewModel';
import IGetWordData from 'src/app/shared/models/viewModels/IGetWordData.viewModel';
import ICheckAnswerResponse from 'src/app/shared/models/responses/ICheckAnswerResponse';

@Component({
  selector: 'app-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.scss'],
})
export class PlayCardComponent implements OnInit, OnChanges {
  @Input() actualWord: IGetWordData;
  @Input() language: Language;
  @Input() checkResponse: ICheckAnswerResponse;
  @Input() numOfCorrectAnswers: number;

  @Output() nextEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() answerEmitter: EventEmitter<IAnswer[]> = new EventEmitter<
    IAnswer[]
  >();

  @ViewChild('nextButton') nextButtonElement: MatButton;
  wordForm: FormGroup;
  languageType = Language;
  genderType = Gender;
  isSubmitted: boolean;

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.actualWord && !changes.actualWord.firstChange) {
      this.createForm();
    }
    if (changes.checkResponse && !changes.checkResponse.firstChange) {
      this.nextButtonElement.focus();
    }
  }

  get answerList(): FormArray {
    return this.wordForm.controls.answerList as FormArray;
  }

  createForm(): void {
    this.wordForm = new FormGroup({
      answerList: new FormArray([]),
    });

    new FormArray([]);
    for (let i: number = 0; i <= this.actualWord?.numOfTranslations - 1; i++) {
      const fg: FormGroup = new FormGroup({
        answer: new FormControl('', i === 0 ? Validators.required : null),
      });
      if (this.language === Language.HU) {
        fg.addControl('gender', new FormControl(''));
      }
      this.answerList.push(fg);
    }
  }

  emitNext(): void {
    this.wordForm.reset();
    this.nextEmitter.emit(true);
    this.isSubmitted = false;
  }

  submitForm(): void {
    this.answerEmitter.emit(this.wordForm.controls.answerList.value);
    this.isSubmitted = true;
  }
}
