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

interface CreateStationResponse {
  success: boolean;
  message: string;
  station: Station;
}

interface UpdateStationResponse {
  success: boolean;
  message: string;
  station: Station;
}

interface DeleteStationResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-admin-stations',
  imports: [FormsModule],
  templateUrl: './admin-stations.html',
  styleUrl: './admin-stations.css'
})
export class AdminStations implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl =
    'http://localhost:5000/api/admin/stations';

  stations: Station[] = [];

  loading = true;

  errorMessage = '';

  showAddForm = false;

  saving = false;

  formError = '';

  showEditForm = false;

  editingStationId = '';

  updating = false;

  editFormError = '';

  deletingStationId = '';

  newStation = {
    stationCode: '',
    stationName: '',
    city: '',
    state: ''
  };

  editStation = {
    stationCode: '',
    stationName: '',
    city: '',
    state: ''
  };

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {

    this.loading = true;
    this.errorMessage = '';

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .get<StationResponse>(
        this.apiUrl,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'ADMIN STATIONS RESPONSE:',
            response
          );

          if (response.success) {

            this.stations =
              response.stations;

          } else {

            this.errorMessage =
              'Unable to load stations';

          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Admin stations error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to connect to admin stations API';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  createStation(): void {

    this.formError = '';

    if (
      !this.newStation.stationCode ||
      !this.newStation.stationName ||
      !this.newStation.city ||
      !this.newStation.state
    ) {

      this.formError =
        'Please fill all station fields.';

      return;
    }

    this.saving = true;

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .post<CreateStationResponse>(
        this.apiUrl,
        this.newStation,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'CREATE STATION RESPONSE:',
            response
          );

          this.saving = false;

          if (response.success) {

            alert(
              'Station created successfully!'
            );

            this.showAddForm = false;

            this.resetStationForm();

            this.loadStations();

          } else {

            this.formError =
              response.message ||
              'Unable to create station.';

          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Create station error:',
            error
          );

          this.saving = false;

          this.formError =
            error?.error?.message ||
            'Unable to create station.';

          this.cdr.detectChanges();
        }

      });
  }


  startEdit(station: Station): void {

    this.showAddForm = false;

    this.showEditForm = true;

    this.editingStationId =
      station._id;

    this.editFormError = '';

    this.editStation = {
      stationCode:
        station.stationCode,

      stationName:
        station.stationName,

      city:
        station.city,

      state:
        station.state
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cdr.detectChanges();
  }


  updateStation(): void {

    this.editFormError = '';

    if (!this.editingStationId) {

      this.editFormError =
        'No station selected for editing.';

      return;
    }

    if (
      !this.editStation.stationCode ||
      !this.editStation.stationName ||
      !this.editStation.city ||
      !this.editStation.state
    ) {

      this.editFormError =
        'Please fill all station fields.';

      return;
    }

    this.updating = true;

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .put<UpdateStationResponse>(
        `${this.apiUrl}/${this.editingStationId}`,
        this.editStation,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'UPDATE STATION RESPONSE:',
            response
          );

          this.updating = false;

          if (response.success) {

            alert(
              'Station updated successfully!'
            );

            this.cancelEdit();

            this.loadStations();

          } else {

            this.editFormError =
              response.message ||
              'Unable to update station.';

          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Update station error:',
            error
          );

          this.updating = false;

          this.editFormError =
            error?.error?.message ||
            'Unable to update station.';

          this.cdr.detectChanges();
        }

      });
  }


  cancelEdit(): void {

    this.showEditForm = false;

    this.editingStationId = '';

    this.updating = false;

    this.editFormError = '';

    this.resetEditForm();

    this.cdr.detectChanges();
  }


  deleteStation(station: Station): void {

    const confirmed =
      confirm(
        `Are you sure you want to delete station ${station.stationCode} - ${station.stationName}?`
      );

    if (!confirmed) {
      return;
    }

    this.deletingStationId =
      station._id;

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .delete<DeleteStationResponse>(
        `${this.apiUrl}/${station._id}`,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'DELETE STATION RESPONSE:',
            response
          );

          this.deletingStationId = '';

          if (response.success) {

            alert(
              'Station deleted successfully!'
            );

            this.loadStations();

          } else {

            alert(
              response.message ||
              'Unable to delete station.'
            );

          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Delete station error:',
            error
          );

          this.deletingStationId = '';

          alert(
            error?.error?.message ||
            'Unable to delete station.'
          );

          this.cdr.detectChanges();
        }

      });
  }


  resetStationForm(): void {

    this.newStation = {
      stationCode: '',
      stationName: '',
      city: '',
      state: ''
    };

    this.formError = '';
  }


  resetEditForm(): void {

    this.editStation = {
      stationCode: '',
      stationName: '',
      city: '',
      state: ''
    };
  }
}