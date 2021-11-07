import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import TicketService from 'src/app/core/services/ticketService/ticket.service';
import { TicketType } from 'src/app/shared/models/enums/TicketType.enum';
import ITicketAddRequest from 'src/app/shared/models/requests/ITicketAddRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-add-ticket-form',
  templateUrl: './add-ticket-form.component.html',
  styleUrls: ['./add-ticket-form.component.scss'],
})
export class AddTicketFormComponent implements OnInit {
  addTicketForm: FormGroup;
  ticketTypeEnum = TicketType;
  addTicketResponse: ICustomResponse;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.addTicketForm = new FormGroup(
      {
        type: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        price: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        date: new FormControl('', [Validators.required]),
        cityName: new FormControl('', [Validators.required]),
        numberOfAllTickets: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      },
      {
        validators: this.dateTimeValidator('date'),
      }
    );
  }

  submitNewTicket(): void {
    this.ticketService
      .addTicket(this.addTicketForm.value)
      .subscribe((addTicketResponse: ICustomResponse) => {
        this.addTicketResponse = addTicketResponse;
      });
  }

  dateTimeValidator(dateControlField: string): ValidatorFn {
    return (fg: FormGroup): ValidationErrors => {
      const dateControl: AbstractControl = fg.controls[dateControlField];
      let validationErrors: ValidationErrors;
      const today = new Date().getTime();
      if (new Date(dateControl.value).getTime() < today) {
        validationErrors = {
          ...dateControl.errors,
          ...{ invalidDate: true },
        };
      } else if (dateControl.errors && !dateControl.errors['invalidDate']) {
        validationErrors = dateControl.errors;
      } else {
        validationErrors = null;
      }
      dateControl.setErrors(validationErrors);
      return validationErrors;
    };
  }
}
