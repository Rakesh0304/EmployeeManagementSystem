# Next-Generation Employee Management System

A full-stack web application built with Angular (v19), Node.js, Express, and MySQL.

## Features

- **Role-Based Access Control**: Separate dashboards for Admin, Manager, and Employee.
- **Attendance System**: Login-time based tracking (On-time, Late, Half-day, LOP).
- **Salary & Payroll**: Automatic monthly calculation with deductions for late/half-days/absences.
- **PDF Payslips**: Downloadable generation of payslips.
- **Leave Management**: Apply for leaves, manage casual leave limits, and role-based approvals.
- **Announcements**: Admin broadcasts and Saturday work scheduling.
- **Modern UI**: Dark-themed, responsive interface using Bootstrap 5 and Glassmorphism.

## Tech Stack

- **Frontend**: Angular 19, Bootstrap 5, RxJS.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Auth**: JWT (JSON Web Tokens).
- **PDF Generation**: PDFKit.

## Setup Instructions

### 1. Database Setup
1. Ensure MongoDB is running on your machine (default port: 27017).
2. The system will automatically create the `employee_management` database on connection.

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with demo users:
   ```bash
   node seed.js
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The API will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular application:
   ```bash
   npm start
   ```
4. Open your browser to `http://localhost:4200`.

## Demo Credentials

All roles use the password: `password123`

- **Admin**: `admin@company.com`
- **Manager**: `manager@company.com`
- **Employee**: `amit.patel@company.com`

## Attendance Rules

| Login Time | Status |
|---|---|
| Before 10:00 AM | On time |
| 10:01 AM - 12:30 PM | Late login |
| 12:31 PM - 1:00 PM | Half Day |
| After 1:00 PM | Loss of Pay (Absent) |
