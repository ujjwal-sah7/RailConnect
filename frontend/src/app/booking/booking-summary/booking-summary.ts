import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  BookingService,
  Passenger,
  Train
} from '../../core/services/booking';

@Component({
  selector: 'app-booking-summary',
  imports: [],
  templateUrl: './booking-summary.html',
  styleUrl: './booking-summary.css'
})
export class BookingSummary {

  private bookingService = inject(BookingService);
  private router = inject(Router);

  train: Train | null = null;
  journeyDate = '';
  travelClass = '';
  passengers: Passenger[] = [];

  // =========================
  // FARE MAP
  // =========================

  fareMap: Record<string, number> = {
    SL: 500,
    '3A': 1000,
    '2A': 1400,
    '1A': 2200
  };


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor() {

    const bookingData =
      this.bookingService.getBookingData();

    this.train =
      bookingData.train;

    this.journeyDate =
      bookingData.journeyDate;

    this.travelClass =
      bookingData.travelClass;

    this.passengers =
      bookingData.passengers;
  }


  // =========================
  // NORMALIZED CLASS
  // =========================

  get normalizedClass(): string {

    return this.travelClass.toUpperCase();

  }


  // =========================
  // FARE PER PASSENGER
  // =========================

  get farePerPassenger(): number {

    return (
      this.fareMap[
        this.normalizedClass
      ] || 0
    );

  }


  // =========================
  // PASSENGER COUNT
  // =========================

  get passengerCount(): number {

    return this.passengers.length;

  }


  // =========================
  // TOTAL FARE
  // =========================

  get totalFare(): number {

    return (
      this.farePerPassenger *
      this.passengerCount
    );

  }


  // =========================
  // CLASS NAME
  // =========================

  get className(): string {

    const classNames:
      Record<string, string> = {

      SL: 'Sleeper',

      '3A': 'AC 3 Tier',

      '2A': 'AC 2 Tier',

      '1A': 'First AC'

    };

    return (
      classNames[
        this.normalizedClass
      ] || this.travelClass
    );

  }


  // =========================
  // CONFIRM BOOKING
  // =========================

  confirmBooking(): void {

    console.log(
      'CONFIRMING BOOKING...'
    );

    console.log(
      'Booking Data:',
      this.bookingService.getBookingData()
    );


    this.bookingService
      .createBooking()
      .subscribe({

        // =========================
        // SUCCESS
        // =========================

        next: (response) => {

          console.log(
            'BOOKING RESPONSE:',
            response
          );


          if (
            response.success &&
            response.booking
          ) {

            // Save the booking returned
            // from backend
            this.bookingService
              .setCreatedBooking(
                response.booking
              );


            console.log(
              'CREATED BOOKING SAVED:',
              response.booking
            );


            // Navigate to success page
            this.router.navigate([
              '/booking/success'
            ]);

          } else {

            alert(
              response.message ||
              'Booking could not be completed'
            );

          }

        },


        // =========================
        // ERROR
        // =========================

        error: (error) => {

          console.error(
            'BOOKING ERROR:',
            error
          );


          alert(
            error.error?.message ||
            'Unable to create booking'
          );

        }

      });

  }

}