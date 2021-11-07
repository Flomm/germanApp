import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SmallTicketComponent } from './components/small-ticket/small-ticket.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { DialogComponent } from './components/dialog/dialog.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import EnumToViewPipe from '../shared/pipes/enumToView/enumToView.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    SmallTicketComponent,
    TicketComponent,
    EnumToViewPipe,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    RouterModule,
    MatBadgeModule,
    ReactiveFormsModule,
  ],
  exports: [
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    SmallTicketComponent,
    TicketComponent,
    EnumToViewPipe,
    MatBadgeModule,
  ],
})
export class SharedModule {}
