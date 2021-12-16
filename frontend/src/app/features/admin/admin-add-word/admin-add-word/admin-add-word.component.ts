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

  constructor() {}

  ngOnInit(): void {
    this.addWordForm = new FormGroup({
      language: new FormControl('', [Validators.required]),
      word: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      // translations: new FormGroup({
      //   translation1: new FormControl('', [Validators.required]),
      // }),
    });
  }

  submitNewTicket(): void {
    console.log(this.addWordForm.value);
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
