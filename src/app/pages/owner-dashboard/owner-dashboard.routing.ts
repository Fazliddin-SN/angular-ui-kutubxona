import { RouterModule, Routes } from '@angular/router';
import { BooksListComponent } from './books/books-list/books-list.component';
import { NewBookComponent } from './books/new-book/new-book.component';
import { NgModule } from '@angular/core';
import { OwnerDashboardComponent } from './owner-dashboard.component';
import { AuthGuardService } from '../../services/auth.guard.service';
import { RoleGuardService } from '../../services/role.guard.service';
import { UpdateBookComponent } from './books/update-book/update-book.component';
import { DeleteBookComponent } from './books/delete-book/delete-book.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerDashboardComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ['owner'] },
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      {
        path: 'books',
        component: BooksListComponent,
      },
      {
        path: 'books/add-book',
        component: NewBookComponent,
      },
      {
        path: 'books/:bookId/edit',
        component: UpdateBookComponent,
      },
      {
        path: 'books/:bookId/delete',
        component: DeleteBookComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerDashboardRoutingModule {}
