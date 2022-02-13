import { Directive, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { paginationTranslation } from '../models/translate/paginationTranslation';

@Directive()
export class AbstractComponentWithPaginator {
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.translatePaginator();
  }

  protected paginator: MatPaginator;

  translatePaginator(): void {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel =
        paginationTranslation.itemsPerPageLabel;
      this.paginator._intl.nextPageLabel = paginationTranslation.nextPageLabel;
      this.paginator._intl.previousPageLabel =
        paginationTranslation.previousPageLabel;
    }
  }
}
