import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NgIf } from '@angular/common';
import { LandingComponent } from '../pages/landing/landing.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIf, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // userRole: string | null = this.authService.getUserRole();
  // isAuthenticated: boolean = this.authService.isLoggedIn(); it does not work since i store the values as static values

  get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  get userRole(): string | null {
    return this.authService.getUserRole();
  }

  sidebarOpen = false;
  // toggling side bar
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // user logout function
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
    console.log(this.isAuthenticated);
    console.log(this.userRole);
  }
}
