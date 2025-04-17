import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: false,
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css',
})
export class OwnerDashboardComponent {
  sidebarOpen = false;
  private authService = inject(AuthService);

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
