import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

let initialEmailValue = '';
const savedForm = localStorage.getItem('saved-login-form');
if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //
  private auhtService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  errorMessage: string = '';
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

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auhtService.login(email!, password!).subscribe({
        next: (res) => {
          //save token
          console.log('repsonse ', res);

          localStorage.setItem('token', res.token);
          this.router.navigate(['/']); //redirect home or dashboard
        },
        error: (err) => {
          console.log('error ', err);

          this.errorMessage =
            err.err?.message || 'Login failed. Please try again.';
        },
      });
    }
    console.log(this.loginForm.value);
  }
}
