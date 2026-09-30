import {
  Component,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


interface PassengerStatus {

  name: string;

  age: number;

  gender: string;

  berthPreference: string;

  status: string;

  coach: string;

  seat: string;

}


interface PNRStatusResponse {

  success: boolean;

  message: string;

  pnrStatus?: {

    pnr: string;

    status: string;

    train: {

      trainNumber: string;

      trainName: string;

      source: string;

      destination: string;

    };

    journeyDate: string;

    travelClass: string;

    passengerCount: number;

    passengers: PassengerStatus[];

    fare: {

      farePerPassenger: number;

      totalFare: number;

    };

  };

}


@Component({

  selector: 'app-pnr-status',

  imports: [FormsModule],

  templateUrl: './pnr-status.html',

  styleUrl: './pnr-status.css'

})


export class PnrStatus {


  private http = inject(HttpClient);

  private cdr = inject(ChangeDetectorRef);


  pnr = '';

  pnrData:
    PNRStatusResponse['pnrStatus'] | null = null;

  isLoading = false;

  errorMessage = '';

  private apiUrl =
    'http://localhost:5000/api/pnr';



  // =========================
  // CHECK PNR
  // =========================

  checkPNR(): void {

    this.errorMessage = '';

    this.pnrData = null;


    const pnrValue =
      this.pnr.trim();



    // =========================
    // VALIDATE PNR
    // =========================

    if (!pnrValue) {

      this.errorMessage =
        'Please enter your 10-digit PNR number';

      this.cdr.detectChanges();

      return;

    }



    if (!/^\d{10}$/.test(pnrValue)) {

      this.errorMessage =
        'PNR must be a 10-digit number';

      this.cdr.detectChanges();

      return;

    }



    // =========================
    // START LOADING
    // =========================

    this.isLoading = true;


    const url =
      `${this.apiUrl}/${pnrValue}`;


    console.log(
      'Checking PNR:',
      pnrValue
    );


    console.log(
      'PNR Request URL:',
      url
    );


    this.cdr.detectChanges();



    // =========================
    // API CALL
    // =========================

    this.http
      .get<PNRStatusResponse>(url)
      .subscribe({

        // =========================
        // SUCCESS
        // =========================

        next: (response) => {

          console.log(
            'PNR RESPONSE:',
            response
          );


          // Stop loading
          this.isLoading = false;


          // Set PNR data
          if (
            response.success &&
            response.pnrStatus
          ) {

            this.pnrData =
              response.pnrStatus;

            // Keep PNR visible in input box
            this.pnr =
              response.pnrStatus.pnr;

            console.log(
              'PNR DATA SET:',
              this.pnrData
            );

            console.log(
              'PNR INPUT VALUE:',
              this.pnr
            );

          } else {

            this.pnrData = null;

            this.errorMessage =
              response.message ||
              'PNR details not found';

          }


          // Force Angular UI update
          this.cdr.detectChanges();

        },


        // =========================
        // ERROR
        // =========================

        error: (error) => {

          console.error(
            'PNR ERROR:',
            error
          );


          this.isLoading = false;

          this.pnrData = null;


          this.errorMessage =
            error.error?.message ||
            'Unable to fetch PNR status';


          // Force Angular UI update
          this.cdr.detectChanges();

        }

      });

  }



  // =========================
  // CLASS NAME
  // =========================

  getClassName(
    travelClass: string
  ): string {

    const classNames:
      Record<string, string> = {

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

}