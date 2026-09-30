import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private router = inject(Router);

  goToBookings(): void {
    this.router.navigate(['/user/my-bookings']);
  }

  goToPNR(): void {
    this.router.navigate(['/pnr/status']);
  }

  goToProfile(): void {
    this.router.navigate(['/user/profile']);
  }

  goToSearch(): void {
    this.router.navigate(['/trains/search']);
  }

}