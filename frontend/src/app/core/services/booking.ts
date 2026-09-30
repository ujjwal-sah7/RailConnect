import { Injectable, inject } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';


export interface Passenger {

  name: string;

  age: number | null;

  gender: string;

  berthPreference: string;

}


export interface Train {

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


export interface BookingData {

  train: Train | null;

  journeyDate: string;

  travelClass: string;

  passengers: Passenger[];

}


export interface CreatedBooking {

  id: string;

  pnr: string;

  trainNumber: string;

  trainName: string;

  source: string;

  destination: string;

  journeyDate: string;

  travelClass: string;

  passengerCount: number;

  farePerPassenger: number;

  totalFare: number;

  status: string;

}


export interface BookingResponse {

  success: boolean;

  message: string;

  booking?: CreatedBooking;

}


export interface MyBooking {

  _id: string;

  user: string;

  train: string;

  trainNumber: string;

  trainName: string;

  source: string;

  destination: string;

  journeyDate: string;

  travelClass: string;

  passengers: Passenger[];

  passengerCount: number;

  farePerPassenger: number;

  totalFare: number;

  pnr: string;

  status: string;

}


export interface MyBookingsResponse {

  success: boolean;

  message: string;

  bookings: MyBooking[];

}


export interface CancelBookingResponse {

  success: boolean;

  message: string;

  booking?: {

    id: string;

    pnr: string;

    status: string;

  };

  totalFare?: number;

  cancellationFee?: number;

  refundAmount?: number;

}


@Injectable({

  providedIn: 'root'

})


export class BookingService {


  private http =
    inject(HttpClient);


  private apiUrl =
    'http://localhost:5000/api/bookings';


  private bookingData: BookingData = {

    train: null,

    journeyDate: '',

    travelClass: '',

    passengers: []

  };


  private createdBooking:
    CreatedBooking | null = null;



  // =====================================
  // SET TRAIN
  // =====================================

  setTrain(train: Train): void {

    this.bookingData.train =
      train;

  }



  // =====================================
  // GET TRAIN
  // =====================================

  getTrain(): Train | null {

    return this.bookingData.train;

  }



  // =====================================
  // SET JOURNEY DATE
  // =====================================

  setJourneyDate(date: string): void {

    this.bookingData.journeyDate =
      date;

  }



  // =====================================
  // GET JOURNEY DATE
  // =====================================

  getJourneyDate(): string {

    return this.bookingData.journeyDate;

  }



  // =====================================
  // SET TRAVEL CLASS
  // =====================================

  setTravelClass(
    travelClass: string
  ): void {

    this.bookingData.travelClass =
      travelClass;

  }



  // =====================================
  // GET TRAVEL CLASS
  // =====================================

  getTravelClass(): string {

    return this.bookingData.travelClass;

  }



  // =====================================
  // SET PASSENGERS
  // =====================================

  setPassengers(
    passengers: Passenger[]
  ): void {

    this.bookingData.passengers =
      passengers;

  }



  // =====================================
  // GET PASSENGERS
  // =====================================

  getPassengers(): Passenger[] {

    return this.bookingData.passengers;

  }



  // =====================================
  // GET COMPLETE BOOKING DATA
  // =====================================

  getBookingData(): BookingData {

    return this.bookingData;

  }



  // =====================================
  // SET CREATED BOOKING
  // =====================================

  setCreatedBooking(
    booking: CreatedBooking
  ): void {

    this.createdBooking =
      booking;

  }



  // =====================================
  // GET CREATED BOOKING
  // =====================================

  getCreatedBooking():
    CreatedBooking | null {

    return this.createdBooking;

  }



  // =====================================
  // CREATE BOOKING
  // POST /api/bookings
  // =====================================

  createBooking():
    Observable<BookingResponse> {


    const train =
      this.bookingData.train;


    if (!train) {

      throw new Error(
        'No train selected'
      );

    }


    const token =
      localStorage.getItem('token');


    if (!token) {

      throw new Error(
        'Login required. Please login again.'
      );

    }


    const payload = {

      trainId:
        train._id,

      journeyDate:
        this.bookingData.journeyDate,

      travelClass:
        this.bookingData.travelClass,

      passengers:
        this.bookingData.passengers

    };


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    console.log(
      'CREATING BOOKING...'
    );


    console.log(
      'BOOKING PAYLOAD:',
      payload
    );


    return this.http.post<BookingResponse>(

      this.apiUrl,

      payload,

      { headers }

    );

  }



  // =====================================
  // GET MY BOOKINGS
  // GET /api/bookings/my
  // =====================================

  getMyBookings():
    Observable<MyBookingsResponse> {


    const token =
      localStorage.getItem('token');


    if (!token) {

      throw new Error(
        'Login required. Please login again.'
      );

    }


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    console.log(
      'FETCHING MY BOOKINGS...'
    );


    return this.http.get<MyBookingsResponse>(

      `${this.apiUrl}/my`,

      { headers }

    );

  }



  // =====================================
  // CANCEL BOOKING
  // PATCH /api/bookings/:id/cancel
  // =====================================

  cancelBooking(
    bookingId: string
  ): Observable<CancelBookingResponse> {


    const token =
      localStorage.getItem('token');


    if (!token) {

      throw new Error(
        'Login required. Please login again.'
      );

    }


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    console.log(
      'CANCELLING BOOKING:',
      bookingId
    );


    return this.http.patch<CancelBookingResponse>(

      `${this.apiUrl}/${bookingId}/cancel`,

      {},

      { headers }

    );

  }



  // =====================================
  // CLEAR BOOKING
  // =====================================

  clearBooking(): void {

    this.bookingData = {

      train: null,

      journeyDate: '',

      travelClass: '',

      passengers: []

    };


    this.createdBooking =
      null;

  }

}