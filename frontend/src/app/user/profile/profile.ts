import {
  Component,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Router } from '@angular/router';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-profile',

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './profile.html',

  styleUrl: './profile.css'
})
export class Profile {

  private http = inject(HttpClient);

  private router = inject(Router);

  private cdr = inject(
    ChangeDetectorRef
  );


  private profileApiUrl =
    'http://localhost:5000/api/users/profile';


  private changePasswordApiUrl =
    'http://localhost:5000/api/users/change-password';


  user: UserProfile | null = null;

  isLoading = false;

  errorMessage = '';


  // Change Password

  showPasswordForm = false;

  currentPassword = '';

  newPassword = '';

  confirmPassword = '';

  passwordLoading = false;

  passwordMessage = '';

  passwordError = '';



  // ===============================
  // LOAD PROFILE
  // ===============================

  loadProfile(): void {

    this.isLoading = true;

    this.errorMessage = '';


    const token =
      localStorage.getItem('token');


    if (!token) {

      this.isLoading = false;

      this.errorMessage =
        'Please login to view your profile.';

      this.cdr.detectChanges();

      return;
    }


    const headers =
      new HttpHeaders({
        Authorization:
          `Bearer ${token}`
      });


    console.log(
      'FETCHING USER PROFILE...'
    );


    this.http
      .get<ProfileResponse>(
        this.profileApiUrl,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'PROFILE RESPONSE:',
            response
          );


          this.isLoading = false;


          if (
            response.success &&
            response.user
          ) {

            this.user =
              response.user;

          } else {

            this.user = null;

            this.errorMessage =
              response.message ||
              'Unable to fetch profile.';
          }


          this.cdr.detectChanges();
        },


        error: (error) => {

          console.error(
            'PROFILE ERROR:',
            error
          );


          this.isLoading = false;

          this.user = null;


          this.errorMessage =
            error.error?.message ||
            'Unable to fetch profile.';


          this.cdr.detectChanges();
        }

      });
  }



  // ===============================
  // SHOW / HIDE PASSWORD FORM
  // ===============================

  changePassword(): void {

    this.showPasswordForm =
      !this.showPasswordForm;


    this.passwordMessage = '';

    this.passwordError = '';


    if (!this.showPasswordForm) {

      this.currentPassword = '';

      this.newPassword = '';

      this.confirmPassword = '';
    }
  }



  // ===============================
  // SUBMIT PASSWORD CHANGE
  // ===============================

  submitPasswordChange(): void {

    this.passwordMessage = '';

    this.passwordError = '';


    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmPassword
    ) {

      this.passwordError =
        'Please fill in all password fields.';

      return;
    }


    if (this.newPassword.length < 6) {

      this.passwordError =
        'New password must be at least 6 characters long.';

      return;
    }


    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      this.passwordError =
        'New password and confirm password do not match.';

      return;
    }


    const token =
      localStorage.getItem('token');


    if (!token) {

      this.passwordError =
        'Your session has expired. Please login again.';

      return;
    }


    this.passwordLoading = true;


    const headers =
      new HttpHeaders({
        Authorization:
          `Bearer ${token}`
      });


    console.log(
      'CHANGING PASSWORD...'
    );


    this.http
      .patch<ChangePasswordResponse>(
        this.changePasswordApiUrl,
        {
          currentPassword:
            this.currentPassword,

          newPassword:
            this.newPassword
        },
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'CHANGE PASSWORD RESPONSE:',
            response
          );


          this.passwordLoading =
            false;


          if (response.success) {

            this.passwordMessage =
              response.message ||
              'Password changed successfully.';


            this.currentPassword = '';

            this.newPassword = '';

            this.confirmPassword = '';


            this.cdr.detectChanges();

          } else {

            this.passwordError =
              response.message ||
              'Unable to change password.';


            this.cdr.detectChanges();
          }

        },


        error: (error) => {

          console.error(
            'CHANGE PASSWORD ERROR:',
            error
          );


          this.passwordLoading =
            false;


          this.passwordError =
            error.error?.message ||
            'Unable to change password.';


          this.cdr.detectChanges();
        }

      });
  }



  // ===============================
  // LOGOUT
  // ===============================

  logout(): void {

    const confirmed =
      window.confirm(
        'Are you sure you want to logout?'
      );


    if (!confirmed) {
      return;
    }


    localStorage.removeItem('token');


    this.router.navigate([
      '/login'
    ]);
  }



  // ===============================
  // BACK TO DASHBOARD
  // ===============================

  goBack(): void {

    this.router.navigate([
      '/user/dashboard'
    ]);
  }



  constructor() {

    this.loadProfile();

  }
}