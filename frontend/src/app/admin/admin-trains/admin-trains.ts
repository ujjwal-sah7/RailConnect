import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { FormsModule } from '@angular/forms';

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
  trains: Train[];
}

interface CreateTrainResponse {
  success: boolean;
  message: string;
  train: Train;
}

interface UpdateTrainResponse {
  success: boolean;
  message: string;
  train: Train;
}

interface DeleteTrainResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-admin-trains',
  imports: [FormsModule],
  templateUrl: './admin-trains.html',
  styleUrl: './admin-trains.css'
})
export class AdminTrains implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = 'http://localhost:5000/api/admin/trains';

  trains: Train[] = [];

  loading = true;

  errorMessage = '';

  showAddForm = false;

  saving = false;

  formError = '';

  deletingTrainId = '';

  /* ================================
     EDIT VARIABLES
  ================================= */

  showEditForm = false;

  editingTrainId = '';

  updating = false;

  editFormError = '';


  /* ================================
     RUNNING DAYS
  ================================= */

  weekDays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];


  /* ================================
     TRAIN CLASSES
  ================================= */

  availableClasses: string[] = [
    'SL',
    '3A',
    '2A',
    '1A'
  ];


  /* ================================
     NEW TRAIN
  ================================= */

  newTrain = {
    trainNumber: '',
    trainName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    runningDays: [] as string[],
    classes: [] as string[]
  };


  /* ================================
     EDIT TRAIN
  ================================= */

  editTrain = {
    trainNumber: '',
    trainName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    runningDays: [] as string[],
    classes: [] as string[]
  };


  /* ================================
     INITIAL LOAD
  ================================= */

  ngOnInit(): void {
    this.loadTrains();
  }


  /* ================================
     LOAD ALL TRAINS
  ================================= */

  loadTrains(): void {

    this.loading = true;

    this.errorMessage = '';

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .get<TrainResponse>(
        this.apiUrl,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'ADMIN TRAINS RESPONSE:',
            response
          );

          if (response.success) {

            this.trains = response.trains;

          } else {

            this.errorMessage =
              'Unable to load trains';

          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Admin trains error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to connect to admin trains API';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  /* ================================
     TOGGLE NEW TRAIN RUNNING DAY
  ================================= */

  toggleRunningDay(day: string): void {

    const index =
      this.newTrain.runningDays.indexOf(day);

    if (index === -1) {

      this.newTrain.runningDays.push(day);

    } else {

      this.newTrain.runningDays.splice(
        index,
        1
      );

    }
  }


  /* ================================
     TOGGLE NEW TRAIN CLASS
  ================================= */

  toggleClass(trainClass: string): void {

    const index =
      this.newTrain.classes.indexOf(trainClass);

    if (index === -1) {

      this.newTrain.classes.push(trainClass);

    } else {

      this.newTrain.classes.splice(
        index,
        1
      );

    }
  }


  /* ================================
     CREATE TRAIN
  ================================= */

  createTrain(): void {

    this.formError = '';

    if (
      !this.newTrain.trainNumber ||
      !this.newTrain.trainName ||
      !this.newTrain.source ||
      !this.newTrain.destination ||
      !this.newTrain.departureTime ||
      !this.newTrain.arrivalTime ||
      !this.newTrain.duration
    ) {

      this.formError =
        'Please fill all required train fields.';

      return;
    }


    if (
      this.newTrain.runningDays.length === 0
    ) {

      this.formError =
        'Please select at least one running day.';

      return;
    }


    if (
      this.newTrain.classes.length === 0
    ) {

      this.formError =
        'Please select at least one train class.';

      return;
    }


    this.saving = true;

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    this.http
      .post<CreateTrainResponse>(
        this.apiUrl,
        this.newTrain,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'CREATE TRAIN RESPONSE:',
            response
          );

          this.saving = false;

          if (response.success) {

            alert(
              'Train created successfully!'
            );

            this.showAddForm = false;

            this.resetTrainForm();

            this.loadTrains();

          } else {

            this.formError =
              response.message ||
              'Unable to create train.';

          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Create train error:',
            error
          );

          this.saving = false;

          this.formError =
            error?.error?.message ||
            'Unable to create train.';

          this.cdr.detectChanges();
        }

      });
  }


  /* ================================
     DELETE TRAIN
  ================================= */

  deleteTrain(train: Train): void {

    const confirmed =
      confirm(
        `Are you sure you want to delete train ${train.trainNumber} - ${train.trainName}?`
      );

    if (!confirmed) {
      return;
    }


    this.deletingTrainId =
      train._id;

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    this.http
      .delete<DeleteTrainResponse>(
        `${this.apiUrl}/${train._id}`,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'DELETE TRAIN RESPONSE:',
            response
          );

          this.deletingTrainId = '';

          if (response.success) {

            alert(
              'Train deleted successfully!'
            );

            this.loadTrains();

          } else {

            alert(
              response.message ||
              'Unable to delete train.'
            );

          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Delete train error:',
            error
          );

          this.deletingTrainId = '';

          alert(
            error?.error?.message ||
            'Unable to delete train.'
          );

          this.cdr.detectChanges();
        }

      });
  }


  /* ================================
     START EDIT
  ================================= */

  startEdit(train: Train): void {

    this.showAddForm = false;

    this.showEditForm = true;

    this.editingTrainId =
      train._id;

    this.editFormError = '';

    this.editTrain = {

      trainNumber:
        train.trainNumber,

      trainName:
        train.trainName,

      source:
        train.source,

      destination:
        train.destination,

      departureTime:
        train.departureTime,

      arrivalTime:
        train.arrivalTime,

      duration:
        train.duration,

      runningDays:
        [...train.runningDays],

      classes:
        [...train.classes]

    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cdr.detectChanges();
  }


  /* ================================
     TOGGLE EDIT RUNNING DAY
  ================================= */

  toggleEditRunningDay(day: string): void {

    const index =
      this.editTrain.runningDays.indexOf(day);

    if (index === -1) {

      this.editTrain.runningDays.push(day);

    } else {

      this.editTrain.runningDays.splice(
        index,
        1
      );

    }
  }


  /* ================================
     TOGGLE EDIT CLASS
  ================================= */

  toggleEditClass(trainClass: string): void {

    const index =
      this.editTrain.classes.indexOf(trainClass);

    if (index === -1) {

      this.editTrain.classes.push(trainClass);

    } else {

      this.editTrain.classes.splice(
        index,
        1
      );

    }
  }


  /* ================================
     UPDATE TRAIN
  ================================= */

  updateTrain(): void {

    this.editFormError = '';

    if (!this.editingTrainId) {

      this.editFormError =
        'No train selected for editing.';

      return;
    }


    if (
      !this.editTrain.trainNumber ||
      !this.editTrain.trainName ||
      !this.editTrain.source ||
      !this.editTrain.destination ||
      !this.editTrain.departureTime ||
      !this.editTrain.arrivalTime ||
      !this.editTrain.duration
    ) {

      this.editFormError =
        'Please fill all required train fields.';

      return;
    }


    if (
      this.editTrain.runningDays.length === 0
    ) {

      this.editFormError =
        'Please select at least one running day.';

      return;
    }


    if (
      this.editTrain.classes.length === 0
    ) {

      this.editFormError =
        'Please select at least one train class.';

      return;
    }


    this.updating = true;

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    this.http
      .put<UpdateTrainResponse>(
        `${this.apiUrl}/${this.editingTrainId}`,
        this.editTrain,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'UPDATE TRAIN RESPONSE:',
            response
          );

          this.updating = false;

          if (response.success) {

            alert(
              'Train updated successfully!'
            );

            this.cancelEdit();

            this.loadTrains();

          } else {

            this.editFormError =
              response.message ||
              'Unable to update train.';

          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Update train error:',
            error
          );

          this.updating = false;

          this.editFormError =
            error?.error?.message ||
            'Unable to update train.';

          this.cdr.detectChanges();
        }

      });
  }


  /* ================================
     CANCEL EDIT
  ================================= */

  cancelEdit(): void {

    this.showEditForm = false;

    this.editingTrainId = '';

    this.updating = false;

    this.editFormError = '';

    this.resetEditForm();

    this.cdr.detectChanges();
  }


  /* ================================
     RESET NEW TRAIN FORM
  ================================= */

  resetTrainForm(): void {

    this.newTrain = {

      trainNumber: '',

      trainName: '',

      source: '',

      destination: '',

      departureTime: '',

      arrivalTime: '',

      duration: '',

      runningDays: [],

      classes: []

    };

    this.formError = '';
  }


  /* ================================
     RESET EDIT FORM
  ================================= */

  resetEditForm(): void {

    this.editTrain = {

      trainNumber: '',

      trainName: '',

      source: '',

      destination: '',

      departureTime: '',

      arrivalTime: '',

      duration: '',

      runningDays: [],

      classes: []

    };
  }
}