import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  BookingService,
  Passenger
} from '../../core/services/booking';

@Component({
  selector: 'app-passenger-form',
  imports: [FormsModule],
  templateUrl: './passenger-form.html',
  styleUrl: './passenger-form.css'
})
export class PassengerForm {

  private bookingService = inject(BookingService);
  private router = inject(Router);


  passengers: Passenger[] = [
    {
      name: '',
      age: null,
      gender: '',
      berthPreference: 'No Preference'
    }
  ];


  // =========================
  // ADD PASSENGER
  // =========================

  addPassenger(): void {

    if (this.passengers.length >= 6) {
      return;
    }

    this.passengers.push({
      name: '',
      age: null,
      gender: '',
      berthPreference: 'No Preference'
    });
  }


  // =========================
  // REMOVE PASSENGER
  // =========================

  removePassenger(index: number): void {

    if (this.passengers.length <= 1) {
      return;
    }

    this.passengers.splice(index, 1);
  }


  // =========================
  // VALIDATE PASSENGERS
  // =========================

  private validatePassengers(): boolean {

    for (const passenger of this.passengers) {

      if (!passenger.name.trim()) {

        alert('Please enter passenger name');

        return false;
      }


      if (
        passenger.age === null ||
        passenger.age < 1 ||
        passenger.age > 120
      ) {

        alert(
          'Passenger age must be between 1 and 120'
        );

        return false;
      }


      if (!passenger.gender) {

        alert('Please select passenger gender');

        return false;
      }

    }

    return true;
  }


  // =========================
  // CONTINUE TO BOOKING
  // =========================

  continueToBooking(): void {

    if (!this.validatePassengers()) {
      return;
    }


    // Save passenger details
    // inside BookingService

    this.bookingService.setPassengers(
      this.passengers
    );


    console.log(
      'PASSENGERS SAVED:',
      this.passengers
    );


    // Go to booking summary

    this.router.navigate([
      '/booking/summary'
    ]);

  }

}