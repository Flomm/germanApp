import { Component, ElementRef, Input, OnInit, Self } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Gender } from 'src/app/shared/models/enums/Gender.enum';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import ITranslationDataModel from 'src/app/shared/models/requests/ITranslationDataModel';
import IModifyWordDialogData from 'src/app/shared/models/viewModels/IModifyWordDialogData.viewModel';

@Component({
  selector: 'app-admin-modify-word',
  templateUrl: './admin-modify-word.component.html',
})
export class AdminModifyWordComponent implements OnInit {
  @Input() modifyWordData: IModifyWordDialogData;

  modifyWordForm: FormGroup;
  currentLanguage: Language;
  languageType = Language;
  genderType = Gender;
  topicType = TopicType;

  constructor(@Self() private selfElement: ElementRef) {}

  ngOnInit(): void {
    this.createForm();
    this.modifyWordForm.disable();
  }

  get translationsFormArray(): FormArray {
    return this.modifyWordForm.get('translations') as FormArray;
  }

  createForm(): void {
    this.currentLanguage = this.modifyWordData.language;
    this.modifyWordForm = new FormGroup({
      topic: new FormControl(this.modifyWordData.wordData.topic, [
        Validators.required,
      ]),
      word: new FormControl(this.modifyWordData.wordData.word, [
        Validators.required,
      ]),
      translations: new FormArray([]),
    });
    if (this.currentLanguage === Language.DE) {
      this.modifyWordForm.addControl(
        'gender',
        new FormControl(this.modifyWordData.wordData.gender || ''),
      );
    }
    this.createFormArrayFromTranslations(
      this.modifyWordData.wordData.translations,
    );
  }

  createFormArrayFromTranslations(
    translationData: ITranslationDataModel[],
  ): void {
    return translationData.forEach((val: ITranslationDataModel) => {
      const newFormGroup: FormGroup = new FormGroup({
        translation: new FormControl(val.translation, [Validators.required]),
      });
      if (this.currentLanguage === Language.HU) {
        newFormGroup.addControl('gender', new FormControl(val.gender || ''));
      }
      this.translationsFormArray.push(newFormGroup);
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
    setTimeout(() => {
      this.scrollToElement(
        `trans${this.translationsFormArray.controls.length - 1}`,
      );
    });
  }

  removeTranslationGroup(index: number): void {
    this.translationsFormArray.removeAt(index);
  }

  toggleForm(): void {
    if (this.modifyWordForm.disabled) {
      this.modifyWordForm.enable();
    } else {
      this.modifyWordForm.disable();
    }
  }

  scrollToElement(id: string): void {
    const newFromGroupDiv: HTMLDivElement =
      this.selfElement.nativeElement.querySelector(`#${id}`);
    newFromGroupDiv.scrollIntoView({ behavior: 'smooth' });
  }
}
