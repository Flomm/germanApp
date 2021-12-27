import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { WordService } from 'src/app/core/services/wordService/word.service';
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
  isMainGenderShown: boolean = true;

  constructor(
    private wordService: WordService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.addWordForm = new FormGroup({
      language: new FormControl(Language.DE, [Validators.required]),
      word: new FormControl('', [Validators.required]),
      gender: new FormControl(''),
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

  submitNewWord(): void {
    const formData = this.addWordForm.value;
    const { language, ...newWordRequest } = formData;
    this.wordService
      .addNewWord(language, newWordRequest)
      .subscribe((addWordResponse: ICustomResponse) => {
        if (!addWordResponse.isError) {
          this.addWordForm.reset();
          this.addWordForm.get('language').setValue(Language.DE);
        }
        this.addWordResponse = addWordResponse;
      });
  }

  addTranslationGroup(): void {
    const newTranslationGroup: FormGroup = new FormGroup({
      translation: new FormControl('', [Validators.required]),
    });
    if (!this.isMainGenderShown) {
      newTranslationGroup.addControl('gender', new FormControl(''));
    }
    this.translationsFormArray.push(newTranslationGroup);
    setTimeout(() => {
      this.scrollToElement(
        `trans${this.translationsFormArray.controls.length - 1}`
      );
    });
  }

  toggleGender(): void {
    if (
      this.addWordForm.controls.language.value === Language.DE &&
      !this.addWordForm.controls.gender
    ) {
      this.isMainGenderShown = true;
      this.addWordForm.addControl('gender', new FormControl(''));
      this.translationsFormArray.controls.forEach((group: FormGroup) => {
        group.removeControl('gender');
      });
    } else {
      this.isMainGenderShown = false;
      this.addWordForm.removeControl('gender');
      this.translationsFormArray.controls.forEach((group: FormGroup) => {
        if (!group.controls.gender) {
          group.addControl('gender', new FormControl(''));
        }
      });
    }
  }

  scrollToElement(id: string): void {
    this.viewportScroller.scrollToAnchor(id);
  }
}
