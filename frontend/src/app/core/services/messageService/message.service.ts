import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private dialog: MatDialog) {}

  openDialog(config?: MatDialogConfig): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, config);
  }
}
