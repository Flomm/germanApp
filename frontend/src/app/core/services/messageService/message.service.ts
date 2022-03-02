import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private spinnerRef: OverlayRef = this.createSpinner();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private overlay: Overlay
  ) {}

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

  showSpinner() {
    this.spinnerRef.attach(new ComponentPortal(SpinnerComponent));
  }

  hideSpinner() {
    this.spinnerRef.detach();
  }

  private createSpinner() {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'default-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
  }
}
