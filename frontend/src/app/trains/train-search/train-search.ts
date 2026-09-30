import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { TrainList } from '../train-list/train-list';

interface Train {
  _id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  classes: string[];
}

interface TrainResponse {
  success: boolean;
  count: number;

  search?: {
    source: string;
    destination: string;
    date: string;
    class: string;
    day: string;
  };

  trains: Train[];
}

interface Station {
  _id: string;
  stationCode: string;
  stationName: string;
  city: string;
  state: string;
}

interface StationResponse {
  success: boolean;
  count: number;
  stations: Station[];
}

@Component({
  selector: 'app-train-search',

  imports: [
    FormsModule,
    TrainList
  ],

  templateUrl: './train-search.html',

  styleUrl: './train-search.css'
})
export class TrainSearch implements OnInit {

  private http = inject(HttpClient);

  private cdr = inject(ChangeDetectorRef);


  // =========================
  // SEARCH FORM DATA
  // =========================

  source = '';

  destination = '';

  date = '';

  travelClass = '';


  // =========================
  // DATA
  // =========================

  trains: Train[] = [];

  stations: Station[] = [];


  // =========================
  // UI STATES
  // =========================

  isLoading = false;

  isLoadingStations = false;

  errorMessage = '';

  searched = false;


  // =========================
  // API URLs
  // =========================

  private apiUrl =
    'http://localhost:5000/api/trains';

  private stationApiUrl =
    'http://localhost:5000/api/stations';


  // =========================
  // COMPONENT INIT
  // =========================

  ngOnInit(): void {

    this.loadStations();

  }


  // =========================
  // LOAD STATIONS
  // =========================

  loadStations(): void {

    this.isLoadingStations = true;


    this.http
      .get<StationResponse>(
        this.stationApiUrl
      )
      .subscribe({

        next: (response) => {

          console.log(
            'STATIONS RESPONSE:',
            response
          );


          this.stations =
            response.stations;


          this.isLoadingStations =
            false;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'STATION LOAD ERROR:',
            error
          );


          this.isLoadingStations =
            false;


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // GET STATION CODE
  // =========================
  getStationCode(value: string): string {

    const cleanValue =
      value.trim();


    // =========================
    // CASE 1
    // Value already contains
    // station code in brackets
    //
    // Example:
    // New Delhi (NDLS)
    // Howrah Junction (HWH)
    // =========================

    const codeMatch =
      cleanValue.match(/\(([A-Za-z0-9]{2,10})\)\s*$/);

    if (codeMatch) {

      return codeMatch[1].toUpperCase();

    }


    // =========================
    // CASE 2
    // Value is already a code
    //
    // Example:
    // NDLS
    // BBS
    // HWH
    // =========================

    const stationByCode =
      this.stations.find(
        station =>
          station.stationCode.toUpperCase() ===
          cleanValue.toUpperCase()
      );

    if (stationByCode) {

      return stationByCode.stationCode.toUpperCase();

    }


    // =========================
    // CASE 3
    // Value is station name
    // =========================

    const stationByName =
      this.stations.find(
        station =>
          station.stationName.toLowerCase() ===
          cleanValue.toLowerCase()
      );

    if (stationByName) {

      return stationByName.stationCode.toUpperCase();

    }


    // =========================
    // CASE 4
    // Value is city
    // =========================

    const stationByCity =
      this.stations.find(
        station =>
          station.city.toLowerCase() ===
          cleanValue.toLowerCase()
      );

    if (stationByCity) {

      return stationByCity.stationCode.toUpperCase();

    }


    // =========================
    // FALLBACK
    // =========================

    return cleanValue.toUpperCase();

  }


  // =========================
  // SEARCH TRAINS
  // =========================

  searchTrains(): void {

    // Reset previous search state

    this.errorMessage = '';

    this.trains = [];

    this.searched = false;


    // =========================
    // GET FORM VALUES
    // =========================

    const sourceValue =
      this.source.trim();

    const destinationValue =
      this.destination.trim();


    // =========================
    // VALIDATION
    // =========================

    if (
      !sourceValue ||
      !destinationValue ||
      !this.date ||
      !this.travelClass
    ) {

      this.errorMessage =
        'Please enter source, destination, date and class';

      return;

    }


    // =========================
    // CONVERT TO STATION CODES
    // =========================

    const sourceCode =
      this.getStationCode(sourceValue);

    const destinationCode =
      this.getStationCode(destinationValue);


    // =========================
    // START LOADING
    // =========================

    this.isLoading = true;


    // =========================
    // CONVERT DATE
    // =========================

    // HTML date input:
    // YYYY-MM-DD

    // Backend expects:
    // DD/MM/YYYY

    const [
      year,
      month,
      day
    ] = this.date.split('-');


    const formattedDate =
      `${day}/${month}/${year}`;


    // =========================
    // CREATE API URL
    // =========================

    const url =
      `${this.apiUrl}/search` +
      `?source=${encodeURIComponent(
        sourceCode
      )}` +
      `&destination=${encodeURIComponent(
        destinationCode
      )}` +
      `&date=${encodeURIComponent(
        formattedDate
      )}` +
      `&class=${encodeURIComponent(
        this.travelClass
      )}`;


    // =========================
    // DEBUG LOGS
    // =========================

    console.log(
      'Searching trains...'
    );

    console.log(
      'Original Source:',
      sourceValue
    );

    console.log(
      'Original Destination:',
      destinationValue
    );

    console.log(
      'Source Code:',
      sourceCode
    );

    console.log(
      'Destination Code:',
      destinationCode
    );

    console.log(
      'Date:',
      formattedDate
    );

    console.log(
      'Class:',
      this.travelClass
    );

    console.log(
      'Request URL:',
      url
    );


    // =========================
    // API REQUEST
    // =========================

    this.http
      .get<TrainResponse>(url)
      .subscribe({

        // =========================
        // SUCCESS
        // =========================

        next: (response) => {

          console.log(
            'TRAIN SEARCH RESPONSE:',
            response
          );


          // Stop loading

          this.isLoading = false;


          // Mark search completed

          this.searched = true;


          // Store trains

          this.trains =
            response.trains;


          // Force Angular UI update

          this.cdr.detectChanges();


          console.log(
            'UI UPDATED'
          );

          console.log(
            'Trains found:',
            this.trains.length
          );

        },


        // =========================
        // ERROR
        // =========================

        error: (error) => {

          console.error(
            'TRAIN SEARCH ERROR:',
            error
          );


          // Stop loading

          this.isLoading = false;


          // Show error

          this.errorMessage =
            error.error?.message ||
            'Unable to search trains';


          // Force Angular UI update

          this.cdr.detectChanges();

        }

      });

  }

}