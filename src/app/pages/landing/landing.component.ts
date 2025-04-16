import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  // check if user is authenticated
  get isAuthenticated() {
    return this.authService.isLoggedIn();
  }
  // logout function
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
