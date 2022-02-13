import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UserRole } from 'src/app/shared/models/enums/UserRole.enum';
import IGetUserResponse from 'src/app/shared/models/responses/IGetUserResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import IGetUserData from 'src/app/shared/models/viewModels/IGetUserData.viewModel';
import { paginationTranslation } from 'src/app/shared/models/translate/paginationTranslation';
import IHasTranslatedPaginator from 'src/app/shared/models/interfaces/IHasTranslatedPaginator';

@Component({
  selector: 'app-user-list-table',
  templateUrl: './user-list-table.component.html',
  styleUrls: ['./user-list-table.component.scss'],
})
export class UserListTableComponent
  implements OnInit, OnChanges, IHasTranslatedPaginator
{
  private paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'email', 'isVerified', 'role'];
  dataSource: MatTableDataSource<IGetUserData>;
  userRoleEnum: object = UserRole;

  @Input()
  getUserResponse: IGetUserResponse;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
    this.translatePaginator();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IGetUserData>([]);
  }

  ngOnChanges(): void {
    if (this.getUserResponse) {
      this.dataSource = new MatTableDataSource<IGetUserData>(
        this.getUserResponse.userList
      );
    }
  }

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
