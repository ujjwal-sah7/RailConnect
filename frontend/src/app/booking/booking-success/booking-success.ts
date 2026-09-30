import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  BookingService,
  CreatedBooking
} from '../../core/services/booking';

@Component({
  selector: 'app-booking-success',
  imports: [],
  templateUrl: './booking-success.html',
  styleUrl: './booking-success.css'
})
export class BookingSuccess {

  private bookingService = inject(BookingService);
  private router = inject(Router);

  booking: CreatedBooking | null = null;

  constructor() {

    this.booking =
      this.bookingService.getCreatedBooking();

    console.log(
      'SUCCESS PAGE BOOKING:',
      this.booking
    );

  }

  getClassName(
    travelClass: string
  ): string {

    const classNames: Record<string, string> = {
      SL: 'Sleeper',
      '3A': 'AC 3 Tier',
      '2A': 'AC 2 Tier',
      '1A': 'First AC'
    };

    return (
      classNames[travelClass] ||
      travelClass
    );
  }

  checkPnrStatus(): void {

    if (!this.booking?.pnr) {
      return;
    }

    this.router.navigate(
      ['/pnr/status'],
      {
        queryParams: {
          pnr: this.booking.pnr
        }
      }
    );

  }

}