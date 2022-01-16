import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  openDialog(config?: MatDialogConfig): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, config);
  }

  openSnackBar(
    message: string,
    action: string,
    config: MatSnackBarConfig
  ): void {
    this.snackBar.open(message, action, config);
  }
}
