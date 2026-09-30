import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserResponse {
  success: boolean;
  count: number;
  users: User[];
}

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {

  private http = inject(HttpClient);

  private cdr = inject(ChangeDetectorRef);

  private apiUrl =
    'http://localhost:5000/api/admin/users';

  users: User[] = [];

  loading = true;

  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;

    this.errorMessage = '';

    const token =
      localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .get<UserResponse>(
        this.apiUrl,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'ADMIN USERS RESPONSE:',
            response
          );

          if (response.success) {

            this.users =
              response.users;

          } else {

            this.errorMessage =
              'Unable to load users';

          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Admin users error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to connect to admin users API';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }
}