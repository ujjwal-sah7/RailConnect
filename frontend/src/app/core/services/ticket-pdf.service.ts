import { Injectable } from '@angular/core';

import jsPDF from 'jspdf';

import { MyBooking } from './booking';


@Injectable({
  providedIn: 'root'
})
export class TicketPdfService {


  generateTicket(booking: MyBooking): void {

    const doc = new jsPDF();


    // ==========================================
    // PAGE SETTINGS
    // ==========================================

    const pageWidth = doc.internal.pageSize.getWidth();

    const margin = 15;

    const contentWidth =
      pageWidth - (margin * 2);


    // ==========================================
    // HEADER
    // ==========================================

    doc.setFillColor(37, 99, 235);

    doc.rect(
      0,
      0,
      pageWidth,
      35,
      'F'
    );


    doc.setTextColor(255, 255, 255);

    doc.setFontSize(22);

    doc.setFont('helvetica', 'bold');

    doc.text(
      'RAILCONNECT',
      margin,
      15
    );


    doc.setFontSize(10);

    doc.setFont('helvetica', 'normal');

    doc.text(
      'Railway E-Ticket',
      margin,
      23
    );


    doc.text(
      'Booking Confirmation',
      pageWidth - margin,
      20,
      {
        align: 'right'
      }
    );


    // ==========================================
    // PNR SECTION
    // ==========================================

    doc.setTextColor(31, 41, 55);

    doc.setFontSize(10);

    doc.setFont('helvetica', 'normal');

    doc.text(
      'PNR NUMBER',
      margin,
      48
    );


    doc.setFontSize(17);

    doc.setFont('helvetica', 'bold');

    doc.text(
      booking.pnr,
      margin,
      57
    );


    // STATUS

    const status =
      booking.status || 'Confirmed';


    if (
      status.toLowerCase() === 'cancelled'
    ) {

      doc.setFillColor(
        254,
        226,
        226
      );

      doc.setTextColor(
        185,
        28,
        28
      );

    } else {

      doc.setFillColor(
        220,
        252,
        231
      );

      doc.setTextColor(
        21,
        128,
        61
      );

    }


    doc.roundedRect(
      pageWidth - 55,
      45,
      40,
      12,
      3,
      3,
      'F'
    );


    doc.setFontSize(10);

    doc.setFont('helvetica', 'bold');

    doc.text(
      status.toUpperCase(),
      pageWidth - 35,
      53,
      {
        align: 'center'
      }
    );


    // ==========================================
    // DIVIDER
    // ==========================================

    doc.setDrawColor(
      220,
      225,
      232
    );

    doc.line(
      margin,
      68,
      pageWidth - margin,
      68
    );


    // ==========================================
    // TRAIN INFORMATION
    // ==========================================

    doc.setTextColor(
      17,
      24,
      39
    );

    doc.setFontSize(16);

    doc.setFont('helvetica', 'bold');

    doc.text(
      booking.trainName,
      margin,
      81
    );


    doc.setFontSize(10);

    doc.setFont('helvetica', 'normal');

    doc.setTextColor(
      107,
      114,
      128
    );

    doc.text(
      `Train No. ${booking.trainNumber}`,
      margin,
      89
    );


    // CLASS

    doc.setFillColor(
      238,
      242,
      255
    );

    doc.roundedRect(
      pageWidth - 48,
      75,
      33,
      13,
      3,
      3,
      'F'
    );


    doc.setTextColor(
      67,
      56,
      202
    );

    doc.setFontSize(10);

    doc.setFont('helvetica', 'bold');

    doc.text(
      booking.travelClass,
      pageWidth - 31.5,
      83,
      {
        align: 'center'
      }
    );


    // ==========================================
    // ROUTE
    // ==========================================

    doc.setTextColor(
      107,
      114,
      128
    );

    doc.setFontSize(8);

    doc.setFont('helvetica', 'bold');

    doc.text(
      'FROM',
      margin,
      105
    );

    doc.text(
      'TO',
      pageWidth - margin,
      105,
      {
        align: 'right'
      }
    );


    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFontSize(13);

    doc.setFont('helvetica', 'bold');

    doc.text(
      booking.source,
      margin,
      114
    );

    doc.text(
      booking.destination,
      pageWidth - margin,
      114,
      {
        align: 'right'
      }
    );


    // Route line

    const lineY = 111;

    doc.setDrawColor(
      147,
      197,
      253
    );

    doc.line(
      margin + 38,
      lineY,
      pageWidth - margin - 38,
      lineY
    );


    doc.setFillColor(
      37,
      99,
      235
    );

    doc.circle(
      margin + 38,
      lineY,
      2,
      'F'
    );

    doc.circle(
      pageWidth - margin - 38,
      lineY,
      2,
      'F'
    );


    // ==========================================
    // JOURNEY DETAILS
    // ==========================================

    doc.setFillColor(
      248,
      250,
      252
    );

    doc.roundedRect(
      margin,
      126,
      contentWidth,
      30,
      3,
      3,
      'F'
    );


    const col1 = margin + 5;

    const col2 = margin + 62;

    const col3 = margin + 120;


    doc.setTextColor(
      107,
      114,
      128
    );

    doc.setFontSize(8);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      'JOURNEY DATE',
      col1,
      136
    );

    doc.text(
      'PASSENGERS',
      col2,
      136
    );

    doc.text(
      'TOTAL FARE',
      col3,
      136
    );


    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFontSize(10);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      booking.journeyDate,
      col1,
      146
    );

    doc.text(
      String(booking.passengerCount),
      col2,
      146
    );

    doc.text(
      `Rs. ${booking.totalFare}`,
      col3,
      146
    );


    // ==========================================
    // PASSENGER DETAILS
    // ==========================================

    let currentY = 171;


    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFontSize(13);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      'Passenger Details',
      margin,
      currentY
    );


    currentY += 9;


    // Table header

    doc.setFillColor(
      241,
      245,
      249
    );

    doc.rect(
      margin,
      currentY,
      contentWidth,
      10,
      'F'
    );


    doc.setTextColor(
      71,
      85,
      105
    );

    doc.setFontSize(8);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      '#',
      margin + 4,
      currentY + 7
    );

    doc.text(
      'NAME',
      margin + 16,
      currentY + 7
    );

    doc.text(
      'AGE',
      margin + 95,
      currentY + 7
    );

    doc.text(
      'GENDER',
      margin + 120,
      currentY + 7
    );

    doc.text(
      'BERTH PREFERENCE',
      margin + 145,
      currentY + 7
    );


    currentY += 10;


    // Passenger rows

    booking.passengers.forEach(
      (passenger, index) => {

        doc.setFillColor(
          255,
          255,
          255
        );

        doc.rect(
          margin,
          currentY,
          contentWidth,
          12,
          'F'
        );


        doc.setDrawColor(
          229,
          231,
          235
        );

        doc.line(
          margin,
          currentY + 12,
          pageWidth - margin,
          currentY + 12
        );


        doc.setTextColor(
          55,
          65,
          81
        );

        doc.setFontSize(8);

        doc.setFont(
          'helvetica',
          'normal'
        );


        doc.text(
          String(index + 1),
          margin + 4,
          currentY + 8
        );


        doc.setFont(
          'helvetica',
          'bold'
        );

        doc.text(
          passenger.name || '-',
          margin + 16,
          currentY + 8
        );


        doc.setFont(
          'helvetica',
          'normal'
        );

        doc.text(
          String(
            passenger.age ?? '-'
          ),
          margin + 95,
          currentY + 8
        );


        doc.text(
          passenger.gender || '-',
          margin + 120,
          currentY + 8
        );


        doc.text(
          passenger.berthPreference || '-',
          margin + 145,
          currentY + 8
        );


        currentY += 12;

      }
    );


    // ==========================================
    // FARE DETAILS
    // ==========================================

    currentY += 15;


    doc.setFillColor(
      248,
      250,
      252
    );

    doc.roundedRect(
      margin,
      currentY,
      contentWidth,
      32,
      3,
      3,
      'F'
    );


    doc.setTextColor(
      71,
      85,
      105
    );

    doc.setFontSize(9);

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.text(
      'Fare per Passenger',
      margin + 8,
      currentY + 11
    );


    doc.text(
      'Number of Passengers',
      margin + 8,
      currentY + 22
    );


    doc.text(
      'Total Fare',
      pageWidth - margin - 8,
      currentY + 11,
      {
        align: 'right'
      }
    );


    doc.text(
      'Booking Status',
      pageWidth - margin - 8,
      currentY + 22,
      {
        align: 'right'
      }
    );


    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      `Rs. ${booking.farePerPassenger}`,
      margin + 65,
      currentY + 11
    );


    doc.text(
      String(booking.passengerCount),
      margin + 65,
      currentY + 22
    );


    doc.setTextColor(
      37,
      99,
      235
    );

    doc.setFontSize(12);

    doc.text(
      `Rs. ${booking.totalFare}`,
      pageWidth - margin - 60,
      currentY + 11
    );


    doc.setTextColor(
      21,
      128,
      61
    );

    doc.setFontSize(9);

    doc.text(
      status.toUpperCase(),
      pageWidth - margin - 8,
      currentY + 22,
      {
        align: 'right'
      }
    );


    // ==========================================
    // FOOTER
    // ==========================================

    const footerY = 275;


    doc.setDrawColor(
      220,
      225,
      232
    );

    doc.line(
      margin,
      footerY - 8,
      pageWidth - margin,
      footerY - 8
    );


    doc.setTextColor(
      107,
      114,
      128
    );

    doc.setFontSize(8);

    doc.setFont(
      'helvetica',
      'normal'
    );


    doc.text(
      'This is a computer-generated ticket.',
      margin,
      footerY
    );


    doc.text(
      'RailConnect',
      pageWidth - margin,
      footerY,
      {
        align: 'right'
      }
    );


    // ==========================================
    // SAVE PDF
    // ==========================================

    const fileName =
      `RailConnect-Ticket-${booking.pnr}.pdf`;


    doc.save(fileName);

  }

}