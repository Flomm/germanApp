import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AdminModifyWordComponent } from 'src/app/features/admin/admin-modify-word/admin-modify-word/admin-modify-word.component';
import IDialogConfig from '../../models/viewModels/IDialogConfig.viewModel';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent
  implements AfterViewInit, AfterViewChecked, OnDestroy
{
  @ViewChild('modifyWordElem', { read: ViewContainerRef })
  vcRef: ViewContainerRef;

  componentRef: ComponentRef<AdminModifyWordComponent>;

  constructor(
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public params: IDialogConfig,
    public dialogRef: MatDialogRef<DialogComponent>,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (this.params.modifyWordData) {
      of(this.resolver.resolveComponentFactory(AdminModifyWordComponent))
        .pipe(delay(0))
        .subscribe((res: ComponentFactory<AdminModifyWordComponent>) => {
          this.componentRef = this.vcRef.createComponent(res);
          this.componentRef.instance.modifyWordData =
            this.params.modifyWordData;
        });
    }
  }

  ngAfterViewChecked(): void {
    if (this.params.modifyWordData) {
      this.changeDetector.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
