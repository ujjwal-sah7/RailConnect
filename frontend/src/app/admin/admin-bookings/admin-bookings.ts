
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

interface UpdateStatusResponse {
  success: boolean;
  message: string;
  booking: Booking;
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.css'
})
export class AdminBookings implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

 private apiUrl = 'https://railconnect-399k.onrender.com/api/admin/bookings';

  bookings: Booking[] = [];

  loading = true;
  errorMessage = '';
  successMessage = '';

  expandedBookingId: string | null = null;
  updatingBookingId: string | null = null;

  readonly bookingStatuses = [
    'Confirmed',
    'Pending',
    'Cancelled'
  ];

  ngOnInit(): void {
    this.loadBookings();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private normalizeStatus(status: string | null | undefined): string {
    const normalized = (status || '').trim().toLowerCase();

    switch (normalized) {
      case 'confirmed':
        return 'Confirmed';

      case 'pending':
        return 'Pending';

      case 'cancelled':
      case 'canceled':
        return 'Cancelled';

      default:
        return 'Pending';
    }
  }

  loadBookings(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.get<BookingResponse>(
      this.apiUrl,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = (response.bookings || []).map(
            (booking) => ({
              ...booking,
              status: this.normalizeStatus(booking.status)
            })
          );
        } else {
          this.errorMessage = 'Unable to load bookings.';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Admin bookings error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to connect to the bookings API.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  togglePassengerDetails(bookingId: string): void {
    this.expandedBookingId =
      this.expandedBookingId === bookingId
        ? null
        : bookingId;
  }

  updateBookingStatus(
    booking: Booking,
    selectedStatus: string
  ): void {
    const newStatus = this.normalizeStatus(selectedStatus);

    if (this.updatingBookingId !== null) {
      return;
    }

    if (booking.status === newStatus) {
      return;
    }

    if (
      newStatus === 'Cancelled' &&
      !window.confirm(
        `Are you sure you want to cancel booking ${booking.pnr}?`
      )
    ) {
      // No update was made; the dropdown remains bound
      // to the original booking status.
      this.cdr.detectChanges();
      return;
    }

    const previousStatus = booking.status;

    this.errorMessage = '';
    this.successMessage = '';
    this.updatingBookingId = booking._id;

    this.http.patch<UpdateStatusResponse>(
      `${this.apiUrl}/${booking._id}/status`,
      { status: newStatus },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (response) => {
        if (response.success && response.booking) {
          const savedStatus = this.normalizeStatus(
            response.booking.status
          );

          // Update the existing object so both the badge
          // and dropdown display the same saved status.
          booking.status = savedStatus;

          this.successMessage =
            `Booking ${booking.pnr} status updated to ${savedStatus}.`;
        } else {
          booking.status = previousStatus;
          this.errorMessage =
            response.message || 'Unable to update booking status.';
        }

        this.updatingBookingId = null;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Booking status update error:', error);

        // Restore the previous status if the API fails.
        booking.status = previousStatus;

        this.errorMessage =
          error?.error?.message ||
          'Unable to update booking status. Please try again.';

        this.updatingBookingId = null;
        this.cdr.detectChanges();
      }
    });
  }
}
