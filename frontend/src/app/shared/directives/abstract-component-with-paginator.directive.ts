import { Directive, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Directive()
export class AbstractComponentWithPaginator {
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.translatePaginator();
  }

  protected paginator: MatPaginator;

  translatePaginator(): void {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = 'Darabszám';
      this.paginator._intl.nextPageLabel = 'Következő';
      this.paginator._intl.previousPageLabel = 'Előző';
    }
  }
}
