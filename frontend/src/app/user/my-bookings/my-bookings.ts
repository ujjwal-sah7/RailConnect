import {
  Component,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

import { BookingService } from '../../core/services/booking';

import { TicketPdfService } from '../../core/services/ticket-pdf.service';


@Component({
  selector: 'app-my-bookings',
  imports: [],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {

  private bookingService =
    inject(BookingService);

  private cdr =
    inject(ChangeDetectorRef);

  private router =
    inject(Router);

  private ticketPdfService =
    inject(TicketPdfService);


  bookings: any[] = [];

  isLoading = false;

  errorMessage = '';


  // =====================================
  // LOAD MY BOOKINGS
  // =====================================

  loadBookings(): void {

    this.isLoading = true;

    this.errorMessage = '';

    console.log(
      'Fetching my bookings...'
    );


    this.bookingService
      .getMyBookings()
      .subscribe({

        next: (response) => {

          console.log(
            'MY BOOKINGS RESPONSE:',
            response
          );


          this.isLoading = false;


          if (response.success) {

            this.bookings =
              response.bookings || [];


            console.log(
              'BOOKINGS:',
              this.bookings
            );

            /*
             * =====================================
             * CALCULATE REFUND FOR ALREADY CANCELLED
             * BOOKINGS
             * =====================================
             *
             * This makes refund details available
             * even after refreshing the page.
             *
             * Cancellation fee = 10%
             * Refund amount = 90%
             */

            this.bookings.forEach(
              (booking: any) => {

                if (
                  booking.status?.toLowerCase() ===
                  'cancelled'
                ) {

                  const totalFare =
                    Number(booking.totalFare) || 0;

                  const cancellationFee =
                    Math.round(
                      totalFare * 10 / 100
                    );

                  const refundAmount =
                    totalFare -
                    cancellationFee;


                  booking.cancellationFee =
                    cancellationFee;

                  booking.refundAmount =
                    refundAmount;

                }

              }
            );

          } else {

            this.bookings = [];

            this.errorMessage =
              response.message ||
              'Unable to fetch bookings';

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'MY BOOKINGS ERROR:',
            error
          );


          this.isLoading = false;

          this.bookings = [];


          this.errorMessage =
            error.error?.message ||
            'Unable to fetch your bookings';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================
  // BACK TO DASHBOARD
  // =====================================

  goBack(): void {

    this.router.navigate([
      '/user/dashboard'
    ]);

  }


  // =====================================
  // SEARCH TRAINS
  // =====================================

  searchTrains(): void {

    this.router.navigate([
      '/trains/search'
    ]);

  }


  // =====================================
  // CHECK PNR
  // =====================================

  checkPNR(pnr: string): void {

    this.router.navigate(
      ['/pnr/status'],
      {
        queryParams: {
          pnr: pnr
        }
      }
    );

  }


  // =====================================
  // DOWNLOAD TICKET PDF
  // =====================================

  downloadTicket(booking: any): void {

    console.log(
      'GENERATING TICKET PDF:',
      booking
    );


    try {

      this.ticketPdfService
        .generateTicket(booking);

    } catch (error) {

      console.error(
        'PDF GENERATION ERROR:',
        error
      );


      alert(
        'Unable to generate ticket PDF. Please try again.'
      );

    }

  }


  // =====================================
  // CANCEL TICKET
  // =====================================

  cancelTicket(booking: any): void {

    // =====================================
    // CHECK BOOKING ID
    // =====================================

    if (!booking?._id) {

      alert(
        'Booking ID is missing.'
      );

      return;

    }


    // =====================================
    // ALREADY CANCELLED
    // =====================================

    if (
      booking.status?.toLowerCase() ===
      'cancelled'
    ) {

      alert(
        'This booking is already cancelled.'
      );

      return;

    }


    // =====================================
    // CONFIRM CANCELLATION
    // =====================================

    const confirmed =
      window.confirm(
        `Are you sure you want to cancel booking ${booking.pnr}?`
      );


    if (!confirmed) {

      return;

    }


    console.log(
      'CANCELLING BOOKING:',
      booking._id
    );


    // =====================================
    // CALL BACKEND API
    // =====================================

    this.bookingService
      .cancelBooking(booking._id)
      .subscribe({

        next: (response) => {

          console.log(
            'CANCEL BOOKING RESPONSE:',
            response
          );


          if (response.success) {

            // =====================================
            // UPDATE BOOKING STATUS
            // =====================================

            booking.status =
              'Cancelled';


            // =====================================
            // CALCULATE REFUND
            // =====================================

            const totalFare =
              Number(
                response.totalFare ??
                booking.totalFare
              ) || 0;


            /*
             * Backend value will be used if it is
             * a valid positive value.
             *
             * Otherwise frontend calculates:
             *
             * Cancellation Fee = 10%
             * Refund = Total Fare - Fee
             */

            let cancellationFee =
              response.cancellationFee;

            let refundAmount =
              response.refundAmount;


            if (
              cancellationFee === undefined ||
              cancellationFee === null ||
              cancellationFee <= 0
            ) {

              cancellationFee =
                Math.round(
                  totalFare * 10 / 100
                );

            }


            if (
              refundAmount === undefined ||
              refundAmount === null ||
              refundAmount <= 0
            ) {

              refundAmount =
                totalFare -
                cancellationFee;

            }


            // =====================================
            // SAVE REFUND DETAILS
            // =====================================

            booking.totalFare =
              totalFare;

            booking.cancellationFee =
              cancellationFee;

            booking.refundAmount =
              refundAmount;


            console.log(
              'TOTAL FARE:',
              booking.totalFare
            );

            console.log(
              'CANCELLATION FEE:',
              booking.cancellationFee
            );

            console.log(
              'REFUND AMOUNT:',
              booking.refundAmount
            );


            // =====================================
            // SHOW CANCELLATION RESULT
            // =====================================

            alert(
              `Ticket cancelled successfully.\n\n` +
              `Total Fare: ₹${booking.totalFare}\n` +
              `Cancellation Fee: ₹${booking.cancellationFee}\n` +
              `Refund Amount: ₹${booking.refundAmount}`
            );


            this.cdr.detectChanges();

          } else {

            alert(
              response.message ||
              'Unable to cancel ticket.'
            );

          }

        },


        error: (error) => {

          console.error(
            'CANCEL BOOKING ERROR:',
            error
          );


          alert(
            error.error?.message ||
            'Unable to cancel ticket. Please try again.'
          );

        }

      });

  }


  // =====================================
  // COMPONENT INITIALIZATION
  // =====================================

  constructor() {

    this.loadBookings();

  }

}