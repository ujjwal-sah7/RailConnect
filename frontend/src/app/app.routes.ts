import { Routes } from '@angular/router';

export const routes: Routes = [

  // =====================================
  // AUTH
  // =====================================

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register')
        .then(m => m.Register)
  },


  // =====================================
  // USER
  // =====================================

  {
    path: 'user/dashboard',
    loadComponent: () =>
      import('./user/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'user/my-bookings',
    loadComponent: () =>
      import('./user/my-bookings/my-bookings')
        .then(m => m.MyBookings)
  },

  {
    path: 'user/profile',
    loadComponent: () =>
      import('./user/profile/profile')
        .then(m => m.Profile)
  },


  // =====================================
  // ADMIN
  // =====================================

  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard)
  },

  {
    path: 'admin/trains',
    loadComponent: () =>
      import('./admin/admin-trains/admin-trains')
        .then(m => m.AdminTrains)
  },

  {
    path: 'admin/stations',
    loadComponent: () =>
      import('./admin/admin-stations/admin-stations')
        .then(m => m.AdminStations)
  },

  {
    path: 'admin/bookings',
    loadComponent: () =>
      import('./admin/admin-bookings/admin-bookings')
        .then(m => m.AdminBookings)
  },

  {
    path: 'admin/users',
    loadComponent: () =>
      import('./admin/admin-users/admin-users')
        .then(m => m.AdminUsers)
  },


  // =====================================
  // GENERAL DASHBOARD
  // =====================================

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard')
        .then(m => m.Dashboard)
  },


  // =====================================
  // TRAINS
  // =====================================

  {
    path: 'trains/search',
    loadComponent: () =>
      import('./trains/train-search/train-search')
        .then(m => m.TrainSearch)
  },

  {
    path: 'trains/details/:id',
    loadComponent: () =>
      import('./trains/train-details/train-details')
        .then(m => m.TrainDetails)
  },


  // =====================================
  // BOOKING
  // =====================================

  {
    path: 'booking/passenger',
    loadComponent: () =>
      import('./booking/passenger-form/passenger-form')
        .then(m => m.PassengerForm)
  },

  {
    path: 'booking/summary',
    loadComponent: () =>
      import('./booking/booking-summary/booking-summary')
        .then(m => m.BookingSummary)
  },

  {
    path: 'booking/success',
    loadComponent: () =>
      import('./booking/booking-success/booking-success')
        .then(m => m.BookingSuccess)
  },


  // =====================================
  // PNR
  // =====================================

  {
    path: 'pnr/status',
    loadComponent: () =>
      import('./pnr/pnr-status/pnr-status')
        .then(m => m.PnrStatus)
  },


  // =====================================
  // DEFAULT
  // =====================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];