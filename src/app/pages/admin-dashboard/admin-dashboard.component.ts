import { Component, signal } from '@angular/core';
import { UserRegisterComponent } from './CRUDs/user-register/user-register.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [UserRegisterComponent, NgIf],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  formIsVisible = false;

  showForm() {
    this.formIsVisible = !this.formIsVisible;
  }
}
