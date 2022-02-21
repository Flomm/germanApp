import {
  AfterViewInit,
  Component,
  ComponentRef,
  Inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminModifyWordComponent } from 'src/app/features/admin/admin-modify-word/admin-modify-word/admin-modify-word.component';
import IDialogConfig from '../../models/viewModels/IDialogConfig.viewModel';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modifyWordElem', { read: ViewContainerRef })
  vcRef: ViewContainerRef;

  componentRef: ComponentRef<AdminModifyWordComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public params: IDialogConfig,
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {}

  ngAfterViewInit(): void {
    if (this.params.modifyWordData) {
      this.componentRef = this.vcRef.createComponent(AdminModifyWordComponent);
      this.componentRef.instance.modifyWordData = this.params.modifyWordData;
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
