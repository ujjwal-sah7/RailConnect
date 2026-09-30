import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminStats {
  totalUsers: number;
  totalTrains: number;
  totalStations: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

export interface AdminStatsResponse {
  success: boolean;
  stats: AdminStats;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/admin';

  // =====================================
  // GET ADMIN STATISTICS
  // =====================================

  getStats(): Observable<AdminStatsResponse> {

    // Use the JWT token saved by the normal Angular login
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<AdminStatsResponse>(
      `${this.apiUrl}/stats`,
      { headers }
    );
  }

}