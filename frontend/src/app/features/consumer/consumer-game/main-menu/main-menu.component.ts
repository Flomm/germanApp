import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Language } from 'src/app/shared/models/enums/Language.enum';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  mainMenuForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.mainMenuForm = new FormGroup({
      language: new FormControl(Language.DE, Validators.required),
      email: new FormControl(10, Validators.required),
    });
  }
}
