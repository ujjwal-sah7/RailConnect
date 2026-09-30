import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  message = '';
  errorMessage = '';
  isLoading = false;

  login(): void {
    this.message = '';
    this.errorMessage = '';

    // Check empty fields
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    console.log('Login button clicked');
    console.log('Email:', this.email);
    console.log('Sending login request to backend...');

    this.isLoading = true;

    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: (response) => {

          console.log('LOGIN RESPONSE:', response);

          this.isLoading = false;

          if (response.token) {
            this.authService.saveToken(response.token);
          }

          this.message = response.message;

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        },

        error: (error) => {

          console.error('LOGIN ERROR:', error);
          console.error('SERVER RESPONSE:', error.error);

          this.isLoading = false;

          this.errorMessage =
            error.error?.message ||
            `Error ${error.status}: ${error.message}`;
        },

        complete: () => {
          console.log('Login request completed');
        }
      });
  }
}