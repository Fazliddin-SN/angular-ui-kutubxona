import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-library-register',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './library-register.component.html',
  styleUrl: './library-register.component.css',
})
export class LibraryRegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  errorMessage: string = '';
  isEmailReadonly = false;
  // library register form
  libForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    library_name: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const ownerEmail = params['email'];
      if (ownerEmail) {
        this.libForm.get('email')!.setValue(ownerEmail);
        this.isEmailReadonly = true;
      }
    });
  }

  // submit method

  onSubmit() {
    if (this.libForm.invalid) {
      this.errorMessage = 'Kerakli Malumotlarni kiriting.';
      return;
    }
    const { library_name, email } = this.libForm.value;
    this.authService.registerLib(email!, library_name!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          text: 'Foydalanuvchi uchun kutubxona yaratildi',
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
}
