import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox-select-all',
  templateUrl: './checkbox-select-all.component.html',
  styleUrls: ['./checkbox-select-all.component.scss'],
})
export class CheckboxSelectAllComponent {
  @Input() control: FormControl;
  @Input() values = [];
  @Input() text = 'Összes';

  isChecked(): boolean {
    return (
      this.control.value &&
      this.values.length &&
      this.control.value.length === this.values.length
    );
  }

  isIndeterminate(): boolean {
    return (
      this.control.value &&
      this.values.length &&
      this.control.value.length &&
      this.control.value.length < this.values.length
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.control.setValue(this.values);
    } else {
      this.control.setValue([]);
    }
  }
}
