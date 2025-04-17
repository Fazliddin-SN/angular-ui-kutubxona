import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Book } from '../interfaces/book.model';
import { Observable, retry } from 'rxjs';
import { GlobalConfigService } from '../global-config.service';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  // http requests
  private http = inject(HttpClient);
  private baseUrl: string;

  constructor(private config: GlobalConfigService) {
    this.baseUrl = config.baseUrl;
  }

  getBooks(): Observable<{ books: Book[] }> {
    // Retrieve token from localStorage or another source
    const token = localStorage.getItem('token');

    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ books: Book[] }>(`${this.baseUrl}/library/books`, {
      headers,
    });
  }
}
