
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

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;

    this.authService.login(
      this.email.trim(),
      this.password
    ).subscribe({
      next: (response) => {
        this.isLoading = false;

        console.log('LOGIN RESPONSE:', response);
        console.log('LOGIN USER:', response.user);
        console.log('LOGIN USER ROLE:', response.user?.role);

        if (!response.success || !response.token) {
          this.errorMessage =
            response.message || 'Login failed';
          return;
        }

        const user = response.user;

        if (!user?.id || !user?.name || !user?.email) {
          this.errorMessage =
            'Login response is missing user details. Please check the backend response.';
          console.error('Incomplete login user:', user);
          return;
        }

        const role = String(user.role ?? '')
          .trim()
          .toLowerCase();

        if (role !== 'admin' && role !== 'user') {
          this.errorMessage =
            'Login succeeded, but the server did not return a valid user role.';
          console.error('Invalid user role:', role);
          return;
        }

        this.authService.saveToken(response.token);

        this.authService.saveUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: role
        });

        if (role === 'admin') {
          console.log('Redirecting to Admin Dashboard');

          this.router.navigateByUrl('/admin/dashboard');
        } else {
          console.log('Redirecting to User Dashboard');

          this.router.navigateByUrl('/user/dashboard');
        }
      },

      error: (error) => {
        this.isLoading = false;

        console.error('Login error:', error);

        this.errorMessage =
          error?.error?.message ||
          `Error ${error.status}: ${error.message}`;
      }
    });
  }
}
