import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Gender } from '../../models/enums/Gender.enum';
import { Language } from '../../models/enums/Language.enum';
import IDialogConfig from '../../models/models/viewModels/IDialogConfig.viewModel';
import ITranslationDataModel from '../../models/requests/ITranslationDataModel';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  modifyWordForm: FormGroup;
  currentLanguage: Language;
  languageType: object = Language;
  genderType: object = Gender;

  constructor(
    @Inject(MAT_DIALOG_DATA) public params: IDialogConfig,
    public dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    if (this.params.modifyWordData) {
      this.createForm();
    }
  }

  get translationsFormArray(): FormArray {
    return this.modifyWordForm.get('translations') as FormArray;
  }

  createForm(): void {
    this.currentLanguage = this.params.modifyWordData.initRequest.language;
    this.modifyWordForm = new FormGroup({
      word: new FormControl(this.params.modifyWordData.initRequest.word, [
        Validators.required,
      ]),
      translations: new FormArray([]),
    });
    if (this.currentLanguage === Language.DE) {
      this.modifyWordForm.addControl(
        'gender',
        new FormControl(this.params.modifyWordData.initRequest.gender || '')
      );
    }
    this.translationsFormArray.controls = this.createFormArrayFromTranslations(
      this.params.modifyWordData.translationList
    );
  }

  createFormArrayFromTranslations(
    translationData: ITranslationDataModel[]
  ): FormGroup[] {
    return translationData.map((val: ITranslationDataModel) => {
      const newFormGroup: FormGroup = new FormGroup({
        translation: new FormControl(val.translation, [Validators.required]),
      });
      if (this.currentLanguage === Language.HU) {
        newFormGroup.addControl('gender', new FormControl(val.gender || ''));
      }
      return newFormGroup;
    });
  }

  addTranslationGroup(): void {
    const newTranslationGroup: FormGroup = new FormGroup({
      translation: new FormControl('', [Validators.required]),
    });
    if (this.currentLanguage === Language.HU) {
      newTranslationGroup.addControl('gender', new FormControl(''));
    }
    this.translationsFormArray.push(newTranslationGroup);
  }
}
