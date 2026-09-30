import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Train {
  _id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
}

interface Passenger {
  _id: string;
  name: string;
  age: number;
  gender: string;
}

interface Booking {
  _id: string;
  pnr: string;
  user: User;
  train: Train;
  passengers: Passenger[];
  journeyDate: string;
  travelClass: string;
  totalFare: number;
  status: string;
  createdAt: string;
}

interface BookingResponse {
  success: boolean;
  count: number;
  bookings: Booking[];
}

@Component({
  selector: 'app-admin-bookings',
  imports: [CommonModule],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.css'
})
export class AdminBookings implements OnInit {

  private http = inject(HttpClient);

  private cdr = inject(ChangeDetectorRef);

  private apiUrl =
    'http://localhost:5000/api/admin/bookings';

  bookings: Booking[] = [];

  loading = true;

  errorMessage = '';

  expandedBookingId: string | null = null;

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {

    this.loading = true;

    this.errorMessage = '';

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .get<BookingResponse>(
        this.apiUrl,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'ADMIN BOOKINGS RESPONSE:',
            response
          );

          if (response.success) {

            this.bookings =
              response.bookings;

          } else {

            this.errorMessage =
              'Unable to load bookings';

          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Admin bookings error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to connect to admin bookings API';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  togglePassengerDetails(bookingId: string): void {

    if (this.expandedBookingId === bookingId) {

      this.expandedBookingId = null;

    } else {

      this.expandedBookingId = bookingId;

    }

    this.cdr.detectChanges();
  }
}