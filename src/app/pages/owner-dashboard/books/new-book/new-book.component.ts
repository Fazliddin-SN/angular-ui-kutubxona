import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-book',
  standalone: false,
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css',
})
export class NewBookComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // storing error message
  errorMessage: string = '';

  bookForm = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });
}
