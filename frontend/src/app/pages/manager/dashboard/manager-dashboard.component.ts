import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { AttendanceService } from '../../../services/attendance.service';
import { AuthService } from '../../../services/auth.service';
import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],

  template: `

    <div class="dashboard-top">

      <div>
        <h1 class="dashboard-title">
          Welcome Back, {{ userName }} 👋
        </h1>

        <p class="dashboard-subtitle">
          Manage attendance, employees, and office activities efficiently.
        </p>
      </div>

      <div class="date-box">

        <div class="date-label">
          TODAY
        </div>

        <div class="date-value">
          {{ today | date:'EEEE, MMM d, y' }}
        </div>

      </div>

    </div>

    <!-- STATS -->

    <div class="stats-grid">

      <div class="stat-card employees-card">

        <div class="stat-icon">
          👥
        </div>

        <div>

          <div class="stat-number">
            {{ stats.totalEmployees }}
          </div>

          <div class="stat-text">
            Employees
          </div>

        </div>

      </div>

      <div class="stat-card present-card">

        <div class="stat-icon">
          ✅
        </div>

        <div>

          <div class="stat-number">
            {{ stats.presentToday }}
          </div>

          <div class="stat-text">
            Present
          </div>

        </div>

      </div>

      <div class="stat-card leave-card">

        <div class="stat-icon">
          📋
        </div>

        <div>

          <div class="stat-number">
            {{ stats.pendingLeaves }}
          </div>

          <div class="stat-text">
            Pending Leaves
          </div>

        </div>

      </div>

      <div class="stat-card status-card">

        <div class="stat-icon">
          🕒
        </div>

        <div>

          <div class="stat-number small">
            {{ todayStatus }}
          </div>

          <div class="stat-text">
            Status
          </div>

        </div>

      </div>

    </div>

    <!-- MAIN GRID -->

    <div class="dashboard-grid">

      <!-- CLOCK CARD -->

      <div class="premium-card">

        <div class="card-header">

          <div>
            <h2>Attendance Clock</h2>
            <p>Track your working hours</p>
          </div>

          <div class="live-indicator">

            <span class="live-dot"></span>

            Active

          </div>

        </div>

        <!-- SIMPLE CLOCK -->

        <div class="simple-clock-box">

          <div class="simple-time">
            {{ currentTime }}
          </div>

          <div class="simple-date">
            {{ today | date:'EEEE, MMM d' }}
          </div>

        </div>

        <!-- BUTTONS -->

        <div class="clock-buttons">

          <button
            class="action-btn clock-in-btn"
            (click)="clockIn()"
            [disabled]="isClockedIn"
          >
            Clock In
          </button>

          <button
            class="action-btn clock-out-btn"
            (click)="clockOut()"
            [disabled]="!isClockedIn || isClockedOut"
          >
            Clock Out
          </button>

        </div>

        <div
          *ngIf="clockMessage"
          class="message-box"
        >
          {{ clockMessage }}
        </div>

      </div>

      <!-- INFO CARD -->

      <div class="premium-card">

        <div class="card-header">

          <div>
            <h2>Office Information</h2>
            <p>Daily schedule details</p>
          </div>

        </div>

        <div class="info-container">

          <div class="info-box">

            <div class="info-left">
              🏢 Office Timing
            </div>

            <div class="info-right">
              10:00 AM - 7:00 PM
            </div>

          </div>

          <div class="info-box">

            <div class="info-left">
              ⏰ Shift Duration
            </div>

            <div class="info-right">
              9 Hours
            </div>

          </div>

          <div class="info-box">

            <div class="info-left">
              ☕ Tea Break
            </div>

            <div class="info-right">
              11:30 AM
            </div>

          </div>

          <div class="info-box">

            <div class="info-left">
              🍽 Lunch Break
            </div>

            <div class="info-right">
              2:00 PM
            </div>

          </div>

          <div class="info-box">

            <div class="info-left">
              📌 Late Mark
            </div>

            <div class="info-right danger-text">
              After 10:01 AM
            </div>

          </div>

        </div>

      </div>

    </div>

  `,

  styles: [`

    *{
      box-sizing:border-box;
    }

    :host{
      display:flex;
      flex-direction:column;
      height:100%;
      padding:20px 24px;
      background:#f4f7fb;
      font-family:Inter,sans-serif;
      min-height:0;
      overflow:auto;
    }

    .dashboard-top{
      display:flex;
      justify-content:space-between;
      align-items:center;
      flex-wrap:wrap;
      gap:20px;
      margin-bottom:28px;
    }

    .dashboard-title{
      margin:0;
      font-size:2.2rem;
      font-weight:800;
      color:#0f172a;
    }

    .dashboard-subtitle{
      margin-top:8px;
      color:#64748b;
      font-size:0.95rem;
    }

    .date-box{
      background:white;
      padding:18px 24px;
      border-radius:22px;
      border:1px solid #e2e8f0;
      box-shadow:0 8px 24px rgba(15,23,42,0.05);
    }

    .date-label{
      font-size:0.72rem;
      font-weight:700;
      color:#2563eb;
      margin-bottom:6px;
      letter-spacing:1px;
    }

    .date-value{
      font-size:0.95rem;
      font-weight:700;
      color:#0f172a;
    }

    /* STATS */

    .stats-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:20px;
      margin-bottom:28px;
    }

    .stat-card{
      border-radius:26px;
      padding:24px;
      display:flex;
      align-items:center;
      gap:18px;
      color:white;
      box-shadow:0 12px 30px rgba(0,0,0,0.08);
    }

    .employees-card{
      background:linear-gradient(135deg,#2563eb,#1d4ed8);
    }

    .present-card{
      background:linear-gradient(135deg,#10b981,#059669);
    }

    .leave-card{
      background:linear-gradient(135deg,#f59e0b,#ea580c);
    }

    .status-card{
      background:linear-gradient(135deg,#7c3aed,#9333ea);
    }

    .stat-icon{
      width:68px;
      height:68px;
      border-radius:20px;
      background:rgba(255,255,255,0.15);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:1.7rem;
    }

    .stat-number{
      font-size:2rem;
      font-weight:800;
      line-height:1;
    }

    .stat-number.small{
      font-size:1.1rem;
    }

    .stat-text{
      margin-top:8px;
      font-size:0.92rem;
    }

    /* GRID */

    .dashboard-grid{
      display:grid;
      grid-template-columns:1.2fr 1fr;
      gap:24px;
    }

    /* CARD */

    .premium-card{
      background:white;
      border-radius:30px;
      padding:30px;
      border:1px solid #e2e8f0;
      box-shadow:0 12px 35px rgba(15,23,42,0.05);
    }

    .card-header{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      margin-bottom:28px;
    }

    .card-header h2{
      margin:0;
      font-size:1.4rem;
      font-weight:800;
      color:#0f172a;
    }

    .card-header p{
      margin-top:6px;
      color:#64748b;
      font-size:0.9rem;
    }

    /* LIVE */

    .live-indicator{
      display:flex;
      align-items:center;
      gap:8px;
      background:#ecfdf5;
      color:#10b981;
      padding:8px 14px;
      border-radius:999px;
      font-size:0.75rem;
      font-weight:700;
    }

    .live-dot{
      width:10px;
      height:10px;
      border-radius:50%;
      background:#10b981;
    }

    /* SIMPLE CLOCK */

    .simple-clock-box{
      width:100%;
      background:linear-gradient(135deg,#1e293b,#0f172a);
      border-radius:24px;
      padding:45px 20px;
      text-align:center;
      margin-bottom:32px;
      box-shadow:0 12px 30px rgba(15,23,42,0.15);
    }

    .simple-time{
      font-size:3.2rem;
      font-weight:800;
      color:white;
      letter-spacing:2px;
      line-height:1;
    }

    .simple-date{
      margin-top:14px;
      color:rgba(255,255,255,0.75);
      font-size:1rem;
      font-weight:500;
    }

    /* BUTTONS */

    .clock-buttons{
      display:flex;
      justify-content:center;
      gap:18px;
      flex-wrap:wrap;
    }

    .action-btn{
      border:none;
      min-width:180px;
      padding:16px 28px;
      border-radius:18px;
      color:white;
      font-size:1rem;
      font-weight:700;
      cursor:pointer;
      transition:0.3s;
    }

    .action-btn:hover{
      transform:translateY(-2px);
    }

    .action-btn:disabled{
      opacity:0.45;
      cursor:not-allowed;
    }

    .clock-in-btn{
      background:linear-gradient(135deg,#10b981,#059669);
    }

    .clock-out-btn{
      background:linear-gradient(135deg,#ef4444,#dc2626);
    }

    /* MESSAGE */

    .message-box{
      margin-top:22px;
      background:#f8fafc;
      border:1px solid #e2e8f0;
      border-radius:16px;
      padding:16px;
      text-align:center;
      font-size:0.92rem;
      font-weight:600;
      color:#334155;
    }

    /* INFO */

    .info-container{
      display:flex;
      flex-direction:column;
      gap:14px;
    }

    .info-box{
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:18px 20px;
      border-radius:18px;
      background:#f8fafc;
    }

    .info-left{
      font-size:0.95rem;
      color:#475569;
      font-weight:600;
    }

    .info-right{
      font-size:0.95rem;
      font-weight:800;
      color:#0f172a;
    }

    .danger-text{
      color:#ef4444;
    }

    /* RESPONSIVE */

    @media(max-width:1100px){

      .dashboard-grid{
        grid-template-columns:1fr;
      }

    }

    @media(max-width:768px){

      :host{
        padding:16px;
      }

      .dashboard-title{
        font-size:1.7rem;
      }

      .simple-time{
        font-size:2.3rem;
      }

      .clock-buttons{
        flex-direction:column;
      }

      .action-btn{
        width:100%;
      }

      .stats-grid{
        grid-template-columns:1fr;
      }

      .premium-card{
        padding:22px;
      }

    }

  `]
})

export class ManagerDashboardComponent implements OnInit {

  userName = '';

  today = new Date();

  currentTime = '';

  isClockedIn = false;

  isClockedOut = false;

  clockMessage = '';

  todayStatus = 'Not In';

  stats = {
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0
  };

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private timeService: TimeService
  ){

    this.userName =
      this.authService.getUser()?.name || '';

    this.timeService
      .getAppTime()
      .subscribe(time => {

        this.today = time;

        this.currentTime =
          time.toLocaleTimeString('en-US',{
            hour:'2-digit',
            minute:'2-digit',
            second:'2-digit'
          });

      });

  }

  ngOnInit(){

    this.loadDashboardStats();

    this.checkTodayStatus();

  }

  loadDashboardStats(){

    this.employeeService
      .getDashboardStats()
      .subscribe(data => {

        this.stats = data;

      });

  }

  checkTodayStatus(){

    this.attendanceService
      .getTodayStatus()
      .subscribe(data => {

        this.isClockedIn = data.clockedIn;

        this.isClockedOut = data.clockedOut;

        this.todayStatus =
          data.status || 'Not In';

      });

  }

  clockIn(){

    this.attendanceService
      .clockIn()
      .subscribe({

        next:(res)=>{

          this.clockMessage = res.message;

          this.checkTodayStatus();

          setTimeout(()=>{
            this.clockMessage = '';
          },3000);

        },

        error:(err)=>{

          this.clockMessage =
            err.error?.message ||
            'Error clocking in';

        }

      });

  }

  clockOut(){

    this.attendanceService
      .clockOut()
      .subscribe({

        next:(res)=>{

          this.clockMessage = res.message;

          this.checkTodayStatus();

          setTimeout(()=>{
            this.clockMessage = '';
          },3000);

        },

        error:(err)=>{

          this.clockMessage =
            err.error?.message ||
            'Error clocking out';

        }

      });

  }

}