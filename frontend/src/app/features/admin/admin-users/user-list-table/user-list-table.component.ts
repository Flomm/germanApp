import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UserRole } from 'src/app/shared/models/enums/UserRole.enum';
import IGetUserResponse from 'src/app/shared/models/responses/IGetUserResponse';
import { MatTableDataSource } from '@angular/material/table';
import IGetUserData from 'src/app/shared/models/viewModels/IGetUserData.viewModel';
import { AbstractComponentWithPaginator } from 'src/app/shared/directives/abstract-component-with-paginator.directive';

@Component({
  selector: 'app-user-list-table',
  templateUrl: './user-list-table.component.html',
  styleUrls: ['./user-list-table.component.scss'],
})
export class UserListTableComponent
  extends AbstractComponentWithPaginator
  implements OnInit, OnChanges
{
  @Input() getUserResponse: IGetUserResponse;

  displayedColumns: string[] = ['name', 'email', 'isVerified', 'role'];
  dataSource: MatTableDataSource<IGetUserData>;
  userRoleEnum: object = UserRole;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IGetUserData>([]);
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(): void {
    if (this.getUserResponse) {
      this.dataSource = new MatTableDataSource<IGetUserData>(
        this.getUserResponse.userList
      );
    }
  }
}
