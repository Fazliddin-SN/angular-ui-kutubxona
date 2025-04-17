import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Book } from '../../../../interfaces/book.model';
import { BookService } from '../../../../services/book.service';
import { DatePipe } from '@angular/common';
import { NewBookComponent } from '../new-book/new-book.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-books-list',
  standalone: false,
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css',
})
export class BooksListComponent implements OnInit {
  private bookService = inject(BookService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  books: Book[] = [];
  errorMessage: string = '';
  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks() {
    const subscription = this.bookService.getBooks().subscribe({
      next: (res) => {
        // console.log('response ', res);
        this.books = res.books;
      },
      error: (err) => {
        //

        this.errorMessage = err.error.error;
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // this navigates to edit component
  edit(bookId: string) {
    this.router.navigate([bookId, 'edit'], { relativeTo: this.route });
  }

  // this navigates to delete component
  delete(bookId: string) {
    this.router.navigate([bookId, 'delete'], { relativeTo: this.route });
  }
}
