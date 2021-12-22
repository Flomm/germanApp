import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
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
  isMainGenderShown: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.addWordForm = new FormGroup({
      language: new FormControl(Language.DE, [Validators.required]),
      word: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      translations: new FormArray([
        new FormGroup({
          translation: new FormControl('', [Validators.required]),
        }),
      ]),
    });
  }

  get translationsFormArray(): FormArray {
    return this.addWordForm.get('translations') as FormArray;
  }

  submitNewWord(lang: Language): void {
    // const addWordRequestData: IAddWordRequest = {
    //   word: this.addWordForm.controls.word.value,

    // }
    console.log(this.addWordForm.value);
  }

  transformFormToRequest(): IAddWordRequest {
    return this.addWordForm.value;
  }

  addTranslationGroup(): void {
    let newTranslationGroup: FormGroup = new FormGroup({
      translation: new FormControl('', [Validators.required]),
    });
    if (!this.isMainGenderShown) {
      newTranslationGroup.addControl(
        'gender',
        new FormControl('', [Validators.required])
      );
    }
    this.translationsFormArray.push(newTranslationGroup);
  }

  toggleGender(): void {
    if (
      this.addWordForm.controls.language.value === Language.DE &&
      !this.addWordForm.controls.gender
    ) {
      this.isMainGenderShown = true;
      this.addWordForm.addControl(
        'gender',
        new FormControl('', [Validators.required])
      );
      this.translationsFormArray.controls.forEach((group: FormGroup) => {
        group.removeControl('gender');
      });
    } else {
      this.isMainGenderShown = false;
      this.addWordForm.removeControl('gender');
      this.translationsFormArray.controls.forEach((group: FormGroup) => {
        if (!group.controls.gender) {
          group.addControl(
            'gender',
            new FormControl('', [Validators.required])
          );
        }
      });
    }
  }
}
