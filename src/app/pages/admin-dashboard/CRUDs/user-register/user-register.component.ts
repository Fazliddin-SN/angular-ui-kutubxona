import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../../services/auth-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Role } from './user.model';
import { NgFor, NgIf } from '@angular/common';

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
  selector: 'app-user-register',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css',
})
export class UserRegisterComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  hasLibrary = false;
  // Define an array for role options
  roles: Role[] = ['user', 'owner', 'admin'];
  // to store and display error messages
  errorMessage = signal<string>('');
  // Declare the register form with reactive form controls and validations
  registerForm = new FormGroup({
    fullname: new FormControl(initialFormValue.fullname || '', [
      Validators.required,
      Validators.minLength(4),
    ]),
    username: new FormControl(initialFormValue.username || '', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl(initialFormValue.email || '', [
      Validators.required,
      Validators.email,
    ]),
    address: new FormControl(initialFormValue.address || '', {
      validators: [Validators.required],
    }),
    phone_number: new FormControl(initialFormValue.phone_number || '', {
      validators: [Validators.required],
    }),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),

    // Role is managed with a select element. We can set a default, e.g., 'user'
    role: new FormControl('user', [Validators.required]),
  });

  // ngOninit () to save entered values within the form
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
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  // email is taken to pass to libra
  enteredEmail: string = '';
  // onSubmit method to send form data to backend via authService
  onSubmit(): void {
    // console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Kerakli malumotlarni kiriting.');
      return;
    }
    // if user registered as owner, we should create a library
    if (this.registerForm.value.role === 'owner') {
      this.hasLibrary = true;
      this.enteredEmail = this.registerForm.value.email;
    }

    const subscription = this.authService
      .registerUser(this.registerForm.value)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            text: "Yangi foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi.",
            timer: 1000,
          }).then(() => {
            if (this.hasLibrary) {
              this.router.navigate(['/library-register'], {
                queryParams: { email: this.enteredEmail },
              });
            } else {
              this.router.navigate(['/']);
            }
          });
        },
        error: (err) => {
          // console.log('error ', err);
          this.errorMessage.set(err.error?.error);
        },
        complete: () => {
          this.registerForm.reset();
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // close event emitter
  @Output() close = new EventEmitter<any>();
  onCloseForm() {
    this, this.close.emit();
  }
}
