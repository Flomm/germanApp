import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UserRole } from 'src/app/shared/models/enums/UserRole.enum';
import IGetUserResponse from 'src/app/shared/models/responses/IGetUserResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import IGetUserData from 'src/app/shared/models/viewModels/IGetUserData.viewModel';

@Component({
  selector: 'app-user-list-table',
  templateUrl: './user-list-table.component.html',
  styleUrls: ['./user-list-table.component.scss'],
})
export class UserListTableComponent implements OnInit, OnChanges {
  private paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'email', 'isVerified', 'role'];
  dataSource: MatTableDataSource<IGetUserData>;
  userRoleEnum: object = UserRole;

  @Input()
  getUserResponse: IGetUserResponse;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IGetUserData>([]);
  }

  ngOnChanges() {
    if (this.getUserResponse) {
      this.dataSource = new MatTableDataSource<IGetUserData>(
        this.getUserResponse.userList
      );
    }
  }
}
