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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import EnumToViewPipe from '../shared/pipes/enumToView/enumToView.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { MatInputAutofocusDirective } from './directives/autofocus-matinput.directive';
import TranslationPipe from './pipes/translationPipe/translation.pipe';
import { CheckboxSelectAllComponent } from './components/checkbox-select-all/checkbox-select-all.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WordTableComponent } from './components/word-table/word-table.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    EnumToViewPipe,
    TranslationPipe,
    WelcomePageComponent,
    MatInputAutofocusDirective,
    CheckboxSelectAllComponent,
    SpinnerComponent,
    WordTableComponent,
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
    MatSnackBarModule,
    RouterModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
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
    MatSnackBarModule,
    EnumToViewPipe,
    TranslationPipe,
    MatBadgeModule,
    WelcomePageComponent,
    MatExpansionModule,
    MatInputAutofocusDirective,
    MatCheckboxModule,
    CheckboxSelectAllComponent,
    MatProgressSpinnerModule,
    WordTableComponent,
  ],
})
export class SharedModule {}
