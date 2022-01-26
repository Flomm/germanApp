import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Language } from 'src/app/shared/models/enums/Language.enum';
import { TopicType } from 'src/app/shared/models/enums/TopicType.enum';
import IGetRandomWordRequest from 'src/app/shared/models/requests/IGetRandomWordRequest';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  @Output() randomWordRequest: EventEmitter<IGetRandomWordRequest> =
    new EventEmitter<IGetRandomWordRequest>();
  mainMenuForm: FormGroup;
  languageType = Language;
  topicType = TopicType;
  topicValues: TopicType[];
  quantityArray: number[] = [10, 25, 50];

  ngOnInit(): void {
    this.topicValues = Object.keys(TopicType)
      .filter((key) => {
        if (!isNaN(parseInt(key))) {
          return key;
        }
      })
      .map((key) => parseInt(key));
    this.mainMenuForm = new FormGroup({
      language: new FormControl(Language.DE, Validators.required),
      topic: new FormControl([]),
      quantity: new FormControl(this.quantityArray[0], Validators.required),
    });
  }

  submitMenuForm(): void {
    console.warn(this.mainMenuForm.value);
    this.randomWordRequest.emit(this.mainMenuForm.value);
  }
}
