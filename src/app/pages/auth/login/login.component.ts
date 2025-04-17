import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth-service';

let initialEmailValue = '';
const savedForm = localStorage.getItem('saved-login-form');
if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  //
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  errorMessage: string = '';
  // create login form with reactive and validative
  loginForm = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailIsInvalid() {
    return (
      this.loginForm.controls.email.touched &&
      this.loginForm.controls.email.dirty &&
      this.loginForm.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.loginForm.controls.password.touched &&
      this.loginForm.controls.password.dirty &&
      this.loginForm.controls.password.invalid
    );
  }

  ngOnInit(): void {
    const subscription = this.loginForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const subscription = this.authService.login(email!, password!).subscribe({
        next: (res) => {
          //save token
          // console.log('repsonse ', res.token);

          localStorage.setItem('token', res.token);
          // storing logged user's role here
          const role = this.authService.getUserRole();
          // console.log('role ', role);

          // as user logs in, they are navigated according to their roles
          switch (role) {
            case 'admin':
              this.router.navigate(['/dashboard/admin']);
              break;
            case 'owner':
              this.router.navigate(['/dashboard/owner']);
              break;
            case 'user':
              this.router.navigate(['/dashboard/user']);
              break;
            default:
              this.router.navigate(['/unauthorized']);
          }
          Swal.fire({
            icon: 'success',
            text: 'Siz muvaffaqiyatli kidringiz.',
            draggable: true,
            timer: 1000,
          }).then(() => {
            this.router.navigate(['/']); //redirect home or dashboard
          });
          return this.loginForm.reset();
        },
        error: (err) => {
          // console.log('error ', err.error);

          this.errorMessage = err.error.error;
          // console.log(this.errorMessage);
        },
      });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
    // console.log(this.loginForm.value);
  }
}
