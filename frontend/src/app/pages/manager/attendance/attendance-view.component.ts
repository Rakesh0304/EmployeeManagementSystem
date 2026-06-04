import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../services/attendance.service';
import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-attendance-view',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `

  <!-- TOP HEADER -->

  <div class="top-header">

    <div>
      <h2>Attendance Analytics</h2>
      <p>Track employee attendance performance and work activity.</p>
    </div>

    <div class="live-date">
      📅 {{ filterDate | date:'EEEE, MMMM d, y' }}
    </div>

  </div>

  <!-- SMALL STATS -->

  <div class="stats-grid">

    <div class="mini-card total">
      <div class="mini-icon">👥</div>

      <div>
        <h3>{{ attendance.length }}</h3>
        <span>Total</span>
      </div>
    </div>

    <div class="mini-card present">
      <div class="mini-icon">✅</div>

      <div>
        <h3>{{ presentCount }}</h3>
        <span>Present</span>
      </div>
    </div>

    <div class="mini-card late">
      <div class="mini-icon">⏰</div>

      <div>
        <h3>{{ lateCount }}</h3>
        <span>Late</span>
      </div>
    </div>

    <div class="mini-card absent">
      <div class="mini-icon">❌</div>

      <div>
        <h3>{{ absentCount }}</h3>
        <span>Absent</span>
      </div>
    </div>

  </div>

  <!-- FILTER SECTION -->

  <div class="filter-card">

    <div class="filter-left">

      <label>Select Attendance Date</label>

      <input
        type="date"
        [(ngModel)]="filterDate"
        class="date-field"
      />

    </div>

    <div class="filter-buttons">

      <button class="btn-primary-custom" (click)="load()">
        Filter
      </button>

      <button class="btn-light-custom" (click)="loadToday()">
        Today
      </button>

    </div>

  </div>

  <!-- MAIN TABLE -->

  <div class="attendance-wrapper">

    <div class="table-header">

      <div>
        <h3>Attendance Records</h3>
        <p>{{ attendance.length }} employee records found</p>
      </div>

    </div>

    <div class="table-responsive">

      <table>

        <thead>

          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Login</th>
            <th>Logout</th>
            <th>Total Hours</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          <tr *ngFor="let a of attendance">

            <td>

              <div class="employee-box">

                <div class="employee-avatar">
                  {{ a.name?.charAt(0) }}
                </div>

                <div>

                  <div class="employee-name">
                    {{ a.name }}
                  </div>

                  <div class="employee-dept">
                    {{ a.department || 'General Department' }}
                  </div>

                </div>

              </div>

            </td>

            <td class="date-cell">
              {{ a.date | date:'MMM d, y' }}
            </td>

            <td>
              <span class="time login">
                {{ a.login_time || '--:--' }}
              </span>
            </td>

            <td>
              <span class="time logout">
                {{ a.logout_time || '--:--' }}
              </span>
            </td>

            <td>

              <div class="hours-chip">
                {{ a.total_hours || 0 }} hrs
              </div>

            </td>

            <td>

              <span
                class="status-chip"
                [ngClass]="a.status.replace('_','-')"
              >
                {{ a.status | titlecase }}
              </span>

            </td>

          </tr>

          <tr *ngIf="attendance.length === 0">

            <td colspan="6" class="empty-state">

              <div class="empty-icon">
                📭
              </div>

              <h4>No Attendance Records</h4>

              <p>No employee attendance found for selected date.</p>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

  `,

  styles: [`

  *{
    box-sizing:border-box;
  }

  :host{
    display:block;
    min-height:100vh;
    padding:24px;
    background:#f4f7fb;
    font-family:Inter,sans-serif;
  }

  /* HEADER */

  .top-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
    gap:20px;
    flex-wrap:wrap;
  }

  .top-header h2{
    margin:0;
    font-size:2rem;
    font-weight:800;
    color:#0f172a;
  }

  .top-header p{
    margin-top:6px;
    color:#64748b;
    font-size:0.92rem;
  }

  .live-date{
    background:white;
    padding:12px 18px;
    border-radius:14px;
    border:1px solid #e2e8f0;
    font-size:0.85rem;
    font-weight:700;
    color:#334155;
    box-shadow:0 4px 15px rgba(0,0,0,0.05);
  }

  /* SMALL STATS */

  .stats-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
    gap:12px;
    margin-bottom:20px;
  }

  .mini-card{
    background:white;
    border-radius:18px;
    padding:14px 16px;
    display:flex;
    align-items:center;
    gap:12px;
    border:1px solid #e2e8f0;
    transition:0.3s;
    box-shadow:0 4px 16px rgba(0,0,0,0.04);
    min-height:85px;
  }

  .mini-card:hover{
    transform:translateY(-3px);
  }

  .mini-icon{
    width:44px;
    height:44px;
    border-radius:14px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.1rem;
    background:#f8fafc;
  }

  .mini-card h3{
    margin:0;
    font-size:1.3rem;
    font-weight:800;
  }

  .mini-card span{
    font-size:0.74rem;
    color:#64748b;
    font-weight:600;
  }

  .total h3{
    color:#7c3aed;
  }

  .present h3{
    color:#10b981;
  }

  .late h3{
    color:#f59e0b;
  }

  .absent h3{
    color:#ef4444;
  }

  /* FILTER */

  .filter-card{
    background:white;
    border-radius:22px;
    padding:18px 22px;
    display:flex;
    justify-content:space-between;
    align-items:end;
    gap:20px;
    margin-bottom:22px;
    flex-wrap:wrap;
    border:1px solid #e2e8f0;
    box-shadow:0 4px 16px rgba(0,0,0,0.04);
  }

  .filter-left label{
    display:block;
    margin-bottom:8px;
    font-size:0.8rem;
    font-weight:700;
    color:#64748b;
  }

  .date-field{
    padding:12px 14px;
    border-radius:14px;
    border:1px solid #dbe3ec;
    background:#f8fafc;
    font-size:0.9rem;
    min-width:220px;
    outline:none;
    transition:0.3s;
  }

  .date-field:focus{
    border-color:#3b82f6;
    background:white;
  }

  .filter-buttons{
    display:flex;
    gap:10px;
  }

  .btn-primary-custom,
  .btn-light-custom{
    border:none;
    border-radius:14px;
    padding:12px 22px;
    font-weight:700;
    cursor:pointer;
    transition:0.3s;
  }

  .btn-primary-custom{
    background:linear-gradient(135deg,#2563eb,#3b82f6);
    color:white;
  }

  .btn-primary-custom:hover{
    transform:translateY(-2px);
  }

  .btn-light-custom{
    background:#e2e8f0;
    color:#0f172a;
  }

  /* TABLE WRAPPER */

  .attendance-wrapper{
    background:white;
    border-radius:28px;
    overflow:hidden;
    border:1px solid #e2e8f0;
    box-shadow:0 10px 35px rgba(0,0,0,0.05);
  }

  .table-header{
    padding:24px 26px 10px;
  }

  .table-header h3{
    margin:0;
    font-size:1.25rem;
    color:#0f172a;
    font-weight:800;
  }

  .table-header p{
    margin-top:5px;
    color:#64748b;
    font-size:0.85rem;
  }

  /* TABLE */

  .table-responsive{
    overflow-x:auto;
  }

  table{
    width:100%;
    border-collapse:collapse;
    min-width:850px;
  }

  thead{
    background:#0f172a;
  }

  th{
    color:white;
    padding:18px;
    font-size:0.76rem;
    text-transform:uppercase;
    letter-spacing:0.5px;
    text-align:left;
  }

  td{
    padding:18px;
    border-bottom:1px solid #eef2f7;
    font-size:0.9rem;
    color:#334155;
  }

  tbody tr{
    transition:0.25s;
  }

  tbody tr:hover{
    background:#f8fafc;
  }

  /* EMPLOYEE */

  .employee-box{
    display:flex;
    align-items:center;
    gap:12px;
  }

  .employee-avatar{
    width:42px;
    height:42px;
    border-radius:14px;
    background:linear-gradient(135deg,#06b6d4,#3b82f6);
    display:flex;
    align-items:center;
    justify-content:center;
    color:white;
    font-weight:700;
    font-size:0.95rem;
    flex-shrink:0;
  }

  .employee-name{
    font-weight:700;
    color:#0f172a;
  }

  .employee-dept{
    margin-top:3px;
    color:#64748b;
    font-size:0.76rem;
  }

  .date-cell{
    color:#475569;
    font-weight:600;
  }

  /* TIME */

  .time{
    padding:8px 12px;
    border-radius:999px;
    font-size:0.76rem;
    font-weight:700;
  }

  .login{
    background:rgba(16,185,129,0.12);
    color:#10b981;
  }

  .logout{
    background:rgba(239,68,68,0.12);
    color:#ef4444;
  }

  /* HOURS */

  .hours-chip{
    background:#f1f5f9;
    padding:8px 12px;
    border-radius:12px;
    display:inline-block;
    font-size:0.8rem;
    font-weight:700;
    color:#0f172a;
  }

  /* STATUS */

  .status-chip{
    padding:8px 14px;
    border-radius:999px;
    font-size:0.75rem;
    font-weight:700;
  }

  .present{
    background:rgba(16,185,129,0.12);
    color:#10b981;
  }

  .late{
    background:rgba(245,158,11,0.14);
    color:#f59e0b;
  }

  .absent{
    background:rgba(239,68,68,0.12);
    color:#ef4444;
  }

  .half-day{
    background:rgba(59,130,246,0.12);
    color:#3b82f6;
  }

  /* EMPTY */

  .empty-state{
    text-align:center;
    padding:70px 20px;
  }

  .empty-icon{
    font-size:3rem;
    margin-bottom:10px;
  }

  .empty-state h4{
    margin:0;
    color:#0f172a;
  }

  .empty-state p{
    margin-top:6px;
    color:#64748b;
  }

  /* MOBILE */

  @media(max-width:768px){

    :host{
      padding:14px;
    }

    .top-header{
      flex-direction:column;
      align-items:flex-start;
    }

    .stats-grid{
      grid-template-columns:repeat(2,1fr);
    }

    .filter-card{
      flex-direction:column;
      align-items:stretch;
    }

    .filter-buttons{
      width:100%;
    }

    .btn-primary-custom,
    .btn-light-custom{
      flex:1;
    }

  }

  `]
})

export class AttendanceViewComponent implements OnInit {

  attendance:any[] = [];

  filterDate = '';

  presentCount = 0;

  lateCount = 0;

  absentCount = 0;

  constructor(
    private attendanceService: AttendanceService,
    private timeService: TimeService
  ) {}

  ngOnInit(){

    this.loadToday();
  }

  loadToday(){

    this.filterDate =
      this.timeService
      .getCurrentTime()
      .toISOString()
      .split('T')[0];

    this.load();
  }

  load(){

    this.attendanceService
      .getAllAttendance({
        date:this.filterDate
      })
      .subscribe(data => {

        this.attendance = data;

        this.presentCount =
          data.filter((a:any) =>
            a.status === 'present'
          ).length;

        this.lateCount =
          data.filter((a:any) =>
            a.status === 'late'
          ).length;

        this.absentCount =
          data.filter((a:any) =>
            a.status === 'absent'
          ).length;

      });

  }

}