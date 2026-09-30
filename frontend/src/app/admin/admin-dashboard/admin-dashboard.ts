import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  AdminService,
  AdminStats
} from '../../core/services/admin';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  private adminService = inject(AdminService);

  private cdr = inject(ChangeDetectorRef);

  stats: AdminStats | null = null;

  loading = true;

  errorMessage = '';

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {

    this.loading = true;

    this.errorMessage = '';

    this.adminService.getStats().subscribe({

      next: (response) => {

        console.log('ADMIN STATS RESPONSE:', response);

        if (response.success) {

          this.stats = response.stats;

        } else {

          this.errorMessage =
            'Unable to load dashboard statistics';

        }

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Admin statistics error:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to connect to admin statistics API';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }
}