import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../services/attendance.service';
import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-attendance-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="attendance-page">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h2>Attendance Management</h2>
          <p>View and manage employee attendance records.</p>
        </div>
      </div>

      <!-- Main Card -->
      <div class="glass-card attendance-card">

        <!-- Filters -->
        <div class="filter-section">

          <div class="filter-group">

            <label class="filter-label">
              Select Date
            </label>

            <input
              type="date"
              [(ngModel)]="filterDate"
              class="form-control-custom date-input"
            />

          </div>

          <div class="filter-actions">

            <button
              class="action-btn primary-btn"
              (click)="loadAttendance()"
            >
              Filter
            </button>

            <button
              class="action-btn secondary-btn"
              (click)="loadToday()"
            >
              Today
            </button>

          </div>

        </div>

        <!-- Table -->
        <div class="table-wrapper">

          <table class="attendance-table">

            <thead>
              <tr>
                <th>Employees</th>
                <th>Department</th>
                <th>Date</th>
                <th>Login</th>
                <th>Logout</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>

              <tr *ngFor="let a of attendance">

                <td class="employee-name">
                  {{ a.name }}
                </td>

                <td>
                  {{ a.department }}
                </td>

                <td>
                  {{ a.date | date:'MMM d, y' }}
                </td>

                <td>
                  {{ a.login_time || '-' }}
                </td>

                <td>
                  {{ a.logout_time || '-' }}
                </td>

                <td class="hours">
                  {{ a.total_hours || '-' }}
                </td>

                <td>

                  <span
                    class="status-badge"
                    [ngClass]="'status-' + a.status.replace('_', '-')"
                  >

                    {{ a.status | titlecase }}

                  </span>

                </td>

                <td class="remarks">
                  {{ a.remarks || '-' }}
                </td>

              </tr>

              <tr *ngIf="attendance.length === 0">

                <td colspan="8" class="empty-state">

                  No attendance records found.

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  `,
  styles: [`

    .attendance-page {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0;
      font-size: 1.9rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .page-header p {
      margin-top: 8px;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .attendance-card {
      padding: 24px;
      border-radius: 24px;
    }

    /* FILTERS */

    .filter-section {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 20px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .filter-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .date-input {
      width: 220px;
      height: 48px;
      border-radius: 14px;
      padding: 0 16px;
      border: 1.5px solid var(--border-color);
      background: rgba(255,255,255,0.8);
      color: var(--text-primary);
      font-size: 0.95rem;
      transition: all 0.25s ease;
    }

    .date-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
    }

    .filter-actions {
      display: flex;
      gap: 14px;
      align-items: center;
    }

    /* SAME SIZE BUTTONS */

    .action-btn {
      min-width: 130px;
      height: 48px;
      border-radius: 14px;
      border: none;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .primary-btn {
      background: linear-gradient(
        135deg,
        #6366f1,
        #8b5cf6
      );

      color: white;

      box-shadow:
        0 10px 20px rgba(99,102,241,0.25);
    }

    .primary-btn:hover {
      transform: translateY(-2px);

      box-shadow:
        0 14px 28px rgba(99,102,241,0.35);
    }

    .secondary-btn {
      background: white;
      color: var(--text-primary);
      border: 1.5px solid var(--border-color);
    }

    .secondary-btn:hover {
      background: #f8fafc;
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px);
    }

    /* TABLE */

    .table-wrapper {
      overflow-x: auto;
      border-radius: 18px;
    }

    .attendance-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1000px;
    }

    .attendance-table thead tr {
      background: rgba(99,102,241,0.06);
    }

    .attendance-table th {
      padding: 18px 16px;
      text-align: left;
      font-size: 0.82rem;
      font-weight: 800;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color);
    }

    .attendance-table td {
      padding: 18px 16px;
      border-bottom: 1px solid rgba(226,232,240,0.7);
      color: var(--text-primary);
      font-size: 0.93rem;
    }

    .attendance-table tbody tr {
      transition: all 0.2s ease;
    }

    .attendance-table tbody tr:hover {
      background: rgba(99,102,241,0.04);
    }

    .employee-name {
      font-weight: 700;
    }

    .hours {
      font-weight: 700;
      color: #059669;
    }

    .remarks {
      color: var(--text-secondary);
      font-size: 0.88rem;
    }

    /* STATUS */

    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: capitalize;
    }

    .status-present {
      background: rgba(16,185,129,0.12);
      color: #059669;
    }

    .status-late {
      background: rgba(245,158,11,0.12);
      color: #d97706;
    }

    .status-half-day {
      background: rgba(99,102,241,0.12);
      color: #4f46e5;
    }

    .status-absent {
      background: rgba(239,68,68,0.12);
      color: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 48px !important;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* RESPONSIVE */

    @media (max-width: 768px) {

      .attendance-page {
        padding: 16px;
      }

      .filter-section {
        flex-direction: column;
        align-items: stretch;
      }

      .date-input {
        width: 100%;
      }

      .filter-actions {
        width: 100%;
      }

      .action-btn {
        flex: 1;
      }

    }

  `]
})
export class AttendanceManageComponent implements OnInit {

  attendance: any[] = [];

  filterDate = '';

  constructor(
    private attendanceService: AttendanceService,
    private timeService: TimeService
  ) {}

  ngOnInit() {
    this.loadToday();
  }

  loadToday() {

    this.filterDate =
      this.timeService
        .getCurrentTime()
        .toISOString()
        .split('T')[0];

    this.loadAttendance();

  }

  loadAttendance() {

    this.attendanceService
      .getAllAttendance({
        date: this.filterDate
      })
      .subscribe(data => {

        this.attendance = data;

      });

  }

}