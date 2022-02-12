import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox-select-all',
  templateUrl: './checkbox-select-all.component.html',
})
export class CheckboxSelectAllComponent {
  @Input() control: FormControl;
  @Input() values: (number | string)[] = [];
  @Input() label: string = 'Összes';

  isChecked(): boolean {
    if (this?.control.value) {
      return this.control?.value.length === this.values.length;
    }
  }

  isIndeterminate(): boolean {
    if (this?.control.value) {
      return this.control?.value.length < this.values.length;
    }
  }

  toggleSelection(change: MatCheckboxChange): void {
    change.checked
      ? this.control.setValue(this.values)
      : this.control.setValue([]);
  }
}
