import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isSidebarVisible = true;  // Sidebar is visible initially

  // Method to toggle the visibility of the sidebar
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
