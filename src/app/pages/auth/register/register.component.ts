import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

// Rename for clarity
let initialFormValue: any = {};
const savedRegisterForm = localStorage.getItem('saved-register-form');
if (savedRegisterForm) {
  try {
    initialFormValue = JSON.parse(savedRegisterForm);
  } catch (error) {
    console.error('Error parsing saved register form:', error);
    initialFormValue = {}; // Fallback to an empty object if parsing fails
  }
}
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private destryRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  // error message from backend
  errorMessage = '';
  // declaring register form with formGroup
  registerForm = new FormGroup({
    fullname: new FormControl(initialFormValue.fullname || '', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    username: new FormControl(initialFormValue.username || '', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl(initialFormValue.email || '', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    address: new FormControl(initialFormValue.address || '', {
      validators: [Validators.required],
    }),
    phone_number: new FormControl(initialFormValue.phone_number || '', {
      validators: [Validators.required],
    }),
  });

  // check email is valid
  get emailIsValid() {
    return (
      this.registerForm.controls.email.touched &&
      this.registerForm.controls.email.dirty &&
      this.registerForm.controls.email.invalid
    );
  }
  // check passowrd is valid
  get passwordIsInvalid() {
    return (
      this.registerForm.controls.password.touched,
      this.registerForm.controls.password.dirty &&
        this.registerForm.controls.password.invalid
    );
  }
  // check full name is valid
  get fullNameIsInvalid() {
    return (
      this.registerForm.controls.fullname.touched,
      this.registerForm.controls.fullname.dirty &&
        this.registerForm.controls.fullname.invalid
    );
  }
  // check user name is valid
  get userNameIsInvalid() {
    return (
      this.registerForm.controls.username.touched,
      this.registerForm.controls.username.dirty &&
        this.registerForm.controls.username.invalid
    );
  }
  // check address is valid
  get addressIsInvalid() {
    return (
      this.registerForm.controls.address.touched,
      this.registerForm.controls.address.dirty &&
        this.registerForm.controls.address.invalid
    );
  }
  // check full name is valid
  get phoneNumberIsInvalid() {
    return (
      this.registerForm.controls.phone_number.touched,
      this.registerForm.controls.phone_number.dirty &&
        this.registerForm.controls.phone_number.invalid
    );
  }

  // ngOninit ()
  ngOnInit(): void {
    const subscription = this.registerForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-register-form',
            JSON.stringify({
              fullname: value.fullname,
              username: value.username,
              email: value.email,
              address: value.address,
              phone_number: value.phone_number,
            })
          );
        },
      });
    this.destryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSubmit() {
    // console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Kerakli malumotlarni kiriting.';
      return;
    }

    const { fullname, username, email, password, address, phone_number } =
      this.registerForm.value;
    const subscription = this.authService
      .register(fullname, username, email, password!, address, phone_number)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            draggable: true,
            text: "Siz muvaqqiyatli ro'yxatdan o'tdingiz",
            timer: 1000,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.errorMessage = err.error.error;
        },
      });
    this.destryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
    return this.registerForm.reset();
  }
}
