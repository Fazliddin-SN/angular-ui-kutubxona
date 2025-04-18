import { NgModule } from '@angular/core';
import { OwnerDashboardComponent } from './owner-dashboard.component';
import { BooksListComponent } from './books/books-list/books-list.component';
import { NewBookComponent } from './books/new-book/new-book.component';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { OwnerDashboardRoutingModule } from './owner-dashboard.routing';
import { UpdateBookComponent } from './books/update-book/update-book.component';
import { DeleteBookComponent } from './books/delete-book/delete-book.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    OwnerDashboardComponent,
    BooksListComponent,
    NewBookComponent,
    UpdateBookComponent,
    DeleteBookComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    OwnerDashboardRoutingModule,
    RouterLink,
    NgIf,
    NgFor,
  ],
})
export class OwnerDashboardModule {}
