import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import IGetWordData from 'src/app/shared/models/models/viewModels/IGetWordData.viewModel';
import IGetWordResponse from 'src/app/shared/models/responses/IGetWordsResponse';

@Component({
  selector: 'app-words-list-table',
  templateUrl: './words-list-table.component.html',
  styleUrls: ['./words-list-table.component.scss']
})
export class WordsListTableComponent implements OnInit {
  private paginator: MatPaginator;
  displayedColumns: string[] = ['word', 'info', 'delete'];
  dataSource: MatTableDataSource<IGetWordData>;

  @Input()
  getWordResponse: IGetWordResponse;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IGetWordData>([]);
  }

  ngOnChanges() {
    if (this.getWordResponse) {
      this.dataSource = new MatTableDataSource<IGetWordData>(
        this.getWordResponse.wordList
      );
    }
  }
}  
