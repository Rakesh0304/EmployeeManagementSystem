import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../services/attendance.service';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h2>My Attendance History</h2>
      <p>Track your login times and work hours.</p>
    </div>

    <div class="glass-card mb-4">
      <div class="d-flex gap-3 align-items-end flex-wrap mb-3">
        <div>
          <label class="form-label text-secondary small">Month</label>
          <select [(ngModel)]="selectedMonth" class="form-select form-select-dark" style="width: 150px;">
            <option *ngFor="let m of months; let i = index" [value]="i + 1">{{ m }}</option>
          </select>
        </div>
        <div>
          <label class="form-label text-secondary small">Year</label>
          <select [(ngModel)]="selectedYear" class="form-select form-select-dark" style="width: 120px;">
            <option *ngFor="let y of years" [value]="y">{{ y }}</option>
          </select>
        </div>
        <button class="btn btn-glow" (click)="loadAttendance()">Filter History</button>
      </div>

      <div class="table-responsive">
        <table class="table table-dark-custom">
          <thead>
            <tr>
              <th>Date</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of attendanceHistory">
              <td>{{ record.date | date:'MMM d, y' }}</td>
              <td>{{ record.login_time || '-' }}</td>
              <td>{{ record.logout_time || '-' }}</td>
              <td>{{ record.total_hours || '-' }} hrs</td>
              <td>
                <span class="badge-status" [ngClass]="'badge-' + record.status.replace('_', '-')">
                  {{ record.status | titlecase }}
                </span>
              </td>
              <td class="small text-secondary">{{ record.remarks || '-' }}</td>
            </tr>
            <tr *ngIf="attendanceHistory.length === 0">
              <td colspan="6" class="text-center py-4 text-secondary">No records found for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MyAttendanceComponent implements OnInit {
  attendanceHistory: any[] = [];
  selectedMonth: number;
  selectedYear: number;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];

  constructor(private attendanceService: AttendanceService) {
    const today = new Date();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
    for(let y = 2024; y <= today.getFullYear(); y++) this.years.push(y);
  }

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.attendanceService.getMyAttendance(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.attendanceHistory = data;
    });
  }
}
