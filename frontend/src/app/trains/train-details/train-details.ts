import {
  Component,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { HttpClient } from '@angular/common/http';


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

  train: Train;
}


@Component({

  selector: 'app-train-details',

  imports: [],

  templateUrl: './train-details.html',

  styleUrl: './train-details.css'

})


export class TrainDetails {


  private route =
    inject(ActivatedRoute);


  private router =
    inject(Router);


  private http =
    inject(HttpClient);


  private cdr =
    inject(ChangeDetectorRef);


  train: Train | null = null;


  // Selected class from Train Search

  selectedClass = '';


  isLoading = true;

  errorMessage = '';


  private apiUrl =
    'https://railconnect-399k.onrender.com/api/trains';


  // =========================
  // INITIALIZE
  // =========================

  ngOnInit(): void {


    const trainId =
      this.route.snapshot.paramMap.get('id');


    // =========================
    // GET SELECTED CLASS
    // =========================

    this.selectedClass =
      this.route.snapshot.queryParamMap.get('class') || '';


    console.log(
      'TRAIN ID:',
      trainId
    );


    console.log(
      'SELECTED CLASS:',
      this.selectedClass
    );


    if (!trainId) {

      this.errorMessage =
        'Train ID is missing';

      this.isLoading = false;

      this.cdr.detectChanges();

      return;
    }


    this.loadTrain(trainId);

  }


  // =========================
  // LOAD TRAIN
  // =========================

  loadTrain(trainId: string): void {


    this.isLoading = true;


    this.http
      .get<TrainResponse>(
        `${this.apiUrl}/${trainId}`
      )
      .subscribe({

        next: (response) => {


          console.log(
            'TRAIN DETAILS RESPONSE:',
            response
          );


          this.train =
            response.train;


          // =========================
          // SET CLASS
          // =========================

          if (
            this.selectedClass
          ) {

            this.train.classes =
              [this.selectedClass];

          }


          this.isLoading = false;


          this.cdr.detectChanges();


        },


        error: (error) => {


          console.error(
            'TRAIN DETAILS ERROR:',
            error
          );


          this.errorMessage =
            error.error?.message ||
            'Unable to load train details';


          this.isLoading = false;


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // GO BACK
  // =========================

  goBack(): void {

    this.router.navigate([
      '/trains/search'
    ]);

  }

}