import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  BookingService,
  Train
} from '../../core/services/booking';

@Component({
  selector: 'app-train-list',
  imports: [],
  templateUrl: './train-list.html',
  styleUrl: './train-list.css'
})
export class TrainList {

  private router = inject(Router);

  private bookingService =
    inject(BookingService);


  @Input() trains: Train[] = [];


  // Journey data received from Train Search

  @Input() journeyDate = '';

  @Input() travelClass = '';


  // =========================
  // VIEW TRAIN DETAILS
  // =========================

  viewDetails(trainId: string): void {

    // =========================
    // NORMALIZE CLASS
    // =========================

    const classMap: Record<string, string> = {

      sleeper: 'SL',

      sl: 'SL',

      '3a': '3A',

      '2a': '2A',

      '1a': '1A'

    };


    const normalizedClass =
      classMap[
        this.travelClass.toLowerCase()
      ] ||
      this.travelClass.toUpperCase();


    console.log(
      'VIEW DETAILS TRAIN ID:',
      trainId
    );

    console.log(
      'VIEW DETAILS CLASS:',
      normalizedClass
    );


    // =========================
    // OPEN TRAIN DETAILS
    // =========================

    this.router.navigate(
      [
        '/trains/details',
        trainId
      ],
      {
        queryParams: {
          class: normalizedClass
        }
      }
    );

  }


  // =========================
  // BOOK TRAIN
  // =========================

  bookTrain(train: Train): void {

    // =========================
    // VALIDATION
    // =========================

    if (!this.journeyDate) {

      alert(
        'Journey date is missing'
      );

      return;
    }


    if (!this.travelClass) {

      alert(
        'Travel class is missing'
      );

      return;
    }


    // =========================
    // NORMALIZE CLASS
    // =========================

    const classMap: Record<string, string> = {

      sleeper: 'SL',

      sl: 'SL',

      '3a': '3A',

      '2a': '2A',

      '1a': '1A'

    };


    const normalizedClass =
      classMap[
        this.travelClass.toLowerCase()
      ] ||
      this.travelClass.toUpperCase();


    // =========================
    // SAVE BOOKING DATA
    // =========================

    this.bookingService.setTrain(train);

    this.bookingService.setJourneyDate(
      this.journeyDate
    );

    this.bookingService.setTravelClass(
      normalizedClass
    );


    console.log(
      'TRAIN SELECTED FOR BOOKING:',
      train
    );

    console.log(
      'JOURNEY DATE:',
      this.journeyDate
    );

    console.log(
      'TRAVEL CLASS:',
      normalizedClass
    );


    // =========================
    // GO TO PASSENGER FORM
    // =========================

    this.router.navigate([
      '/booking/passenger'
    ]);

  }

}