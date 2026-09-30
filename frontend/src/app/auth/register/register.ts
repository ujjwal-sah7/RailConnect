import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  message = '';
  errorMessage = '';
  isLoading = false;

  register(): void {
    this.message = '';
    this.errorMessage = '';

    // Check empty fields
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    console.log('Register button clicked');
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Sending request to backend...');

    this.isLoading = true;

    this.authService
      .register(this.name, this.email, this.password)
      .subscribe({
        next: (response) => {

          console.log('REGISTER RESPONSE:', response);

          this.isLoading = false;

          if (response.token) {
            this.authService.saveToken(response.token);
          }

          this.message = response.message;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },

        error: (error) => {

          console.error('REGISTER ERROR:', error);
          console.error('SERVER RESPONSE:', error.error);

          this.isLoading = false;

          this.errorMessage =
            error.error?.message || `Error ${error.status}: ${error.message}`;
        },

        complete: () => {
          console.log('Register request completed');
        }
      });
  }
}