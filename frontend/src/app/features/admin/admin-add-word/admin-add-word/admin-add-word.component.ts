import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Gender } from 'src/app/shared/models/enums/Gender.enum';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import IAddWordRequest from 'src/app/shared/models/requests/IAddWordRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-admin-add-word',
  templateUrl: './admin-add-word.component.html',
  styleUrls: ['./admin-add-word.component.scss'],
})
export class AdminAddWordComponent implements OnInit {
  addWordForm: FormGroup;
  addWordResponse: ICustomResponse;
  genderType = Gender;
  languageType = Language;
  isGenderShown: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.addWordForm = new FormGroup({
      language: new FormControl('', [Validators.required]),
      word: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      translation1: new FormGroup({
        translation1Meaning: new FormControl('', [Validators.required]),
        translation1Gender: new FormControl('', [Validators.required]),
      }),
    });
  }

  submitNewWord(lang: Language): void {
    // const addWordRequestData: IAddWordRequest = {
    //   word: this.addWordForm.controls.word.value,

    // }
    console.log(this.addWordForm.value);
  }

  genderSetter(): void {
    if (this.addWordForm.controls.language.value === Language.DE) {
      this.isGenderShown = true;
      this.addWordForm.addControl(
        'gender',
        new FormControl('', [Validators.required])
      );
    } else {
      this.isGenderShown = false;
    }
    console.warn(this.isGenderShown);
  }

  // dateTimeValidator(dateControlField: string): ValidatorFn {
  //   return (fg: FormGroup): ValidationErrors => {
  //     const dateControl: AbstractControl = fg.controls[dateControlField];
  //     let validationErrors: ValidationErrors;
  //     const today = new Date().getTime();
  //     if (new Date(dateControl.value).getTime() < today) {
  //       validationErrors = {
  //         ...dateControl.errors,
  //         ...{ invalidDate: true },
  //       };
  //     } else if (dateControl.errors && !dateControl.errors['invalidDate']) {
  //       validationErrors = dateControl.errors;
  //     } else {
  //       validationErrors = null;
  //     }
  //     dateControl.setErrors(validationErrors);
  //     return validationErrors;
  //   };
  // }
}
