import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../services/attendance.service';
import { AuthService } from '../../../services/auth.service';
import { AnnouncementService } from '../../../services/announcement.service';
import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-emp-dashboard',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="page-header employee-profile-header">

      <div>

      <h2>
        Welcome, {{ userName }} 👋
      </h2>

      <p>
        Here's what's happening today.
      </p>

      </div>

      <div class="profile-photo-card">
        <div class="profile-photo">
          <img
            *ngIf="profilePicture; else employeeProfileInitial"
            [src]="profilePicture"
            [alt]="userName + ' profile picture'"
          />

          <ng-template #employeeProfileInitial>
            {{ userName.charAt(0) || '?' }}
          </ng-template>
        </div>

        <div class="profile-photo-content">
          <strong>{{ profileSubtitle }}</strong>

          <label class="profile-upload-btn">
            Change Profile
            <input
              type="file"
              accept="image/*"
              (change)="onProfilePictureSelected($event)"
            />
          </label>
        </div>
      </div>

    </div>

    <!-- TOP SECTION -->

    <div class="row g-4 mb-4">

      <!-- CLOCK -->

      <div class="col-lg-6">

        <div class="clock-widget animate-fadeInUp">

          <div class="clock-glow"></div>

          <div class="clock-label">
            LIVE TIME
          </div>

          <div class="time">
            {{ currentTime }}
          </div>

          <div class="date">
            {{ today | date:'EEEE, MMMM d, y' }}
          </div>

          <!-- BUTTONS -->

          <div class="clock-actions">

            <button
              class="clock-btn clock-in"
              (click)="clockIn()"
              [disabled]="isClockedIn"
            >
              <span class="dot"></span>
              Clock In
            </button>

            <button
              class="clock-btn clock-out"
              (click)="clockOut()"
              [disabled]="!isClockedIn || isClockedOut"
            >
              <span class="dot"></span>
              Clock Out
            </button>

          </div>

          <!-- MESSAGE -->

          <div
            *ngIf="clockMessage"
            class="clock-message"
          >
            {{ clockMessage }}
          </div>

        </div>

      </div>

      <!-- STATUS -->

      <div class="col-lg-6">

        <div class="glass-card h-100 animate-fadeInUp delay-1">

          <h5 class="section-title">
            Today's Status
          </h5>

          <div class="info-item">

            <span>
              Status
            </span>

            <span
              class="badge-status"
              [ngClass]="'badge-' + (todayData.status?.replace('_', '-') || 'absent')"
            >
              {{ (todayData.status || 'Not In') | titlecase }}
            </span>

          </div>

          <div class="info-item">

            <span>
              Login Time
            </span>

            <strong>
              {{ todayData.login_time || '--:--' }}
            </strong>

          </div>

          <div class="info-item">

            <span>
              Logout Time
            </span>

            <strong>
              {{ todayData.logout_time || '--:--' }}
            </strong>

          </div>

          <div class="info-item">

            <span>
              Total Hours
            </span>

            <strong>
              {{ todayData.total_hours || '0' }} hrs
            </strong>

          </div>

        </div>

      </div>

    </div>

    <!-- BOTTOM -->

    <div class="row g-4">

      <!-- ANNOUNCEMENTS -->

      <div class="col-lg-8">

        <div class="glass-card animate-fadeInUp delay-2">

          <h5 class="section-title">
            Latest Announcements
          </h5>

          <div
            *ngIf="announcements.length === 0"
            class="empty-state"
          >
            No announcements yet.
          </div>

          <div
            *ngFor="let ann of announcements.slice(0, 3)"
            class="announcement-item"
          >

            <h6>
              {{ ann.title }}
            </h6>

            <p>
              {{ ann.message }}
            </p>

            <small>
              {{ ann.created_at | date:'MMM d, y' }}
            </small>

          </div>

        </div>

      </div>

      <!-- SHIFT DETAILS -->

      <div class="col-lg-4">

        <div class="glass-card animate-fadeInUp delay-3">

          <h5 class="section-title">
            Shift Details
          </h5>

          <div class="shift-item">

            <span>
              Shift Duration
            </span>

            <strong>
              9 Hours
            </strong>

          </div>

          <div class="shift-item">

            <span>
              Start Time
            </span>

            <strong>
              10:00 AM
            </strong>

          </div>

          <div class="shift-item">

            <span>
              Deduction Starts
            </span>

            <strong>
              10:01 AM
            </strong>

          </div>

        </div>

      </div>

    </div>
  `,

  styles: [`

    /* =========================
       PAGE HEADER
    ========================= */

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }

    .profile-photo-card {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 270px;
      padding: 14px 16px;
      border: 1px solid rgba(99,102,241,0.16);
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(238,242,255,0.72));
      box-shadow: 0 16px 34px rgba(15,23,42,0.08);
    }

    .profile-photo {
      width: 76px;
      height: 76px;
      border-radius: 22px;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 900;
      overflow: hidden;
      flex-shrink: 0;
      border: 4px solid white;
      box-shadow: 0 14px 28px rgba(99,102,241,0.22);
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-photo-content {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .profile-photo-content strong {
      color: #0f172a;
      font-size: 0.98rem;
      font-weight: 900;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .profile-upload-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      min-height: 32px;
      padding: 0 12px;
      border-radius: 9px;
      background: #6366f1;
      color: white;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      margin: 0;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(99,102,241,0.22);
      transition: 0.2s ease;
    }

    .profile-upload-btn:hover {
      background: #4f46e5;
      transform: translateY(-1px);
    }

    .profile-upload-btn input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .page-header h2 {

      font-size: 2rem;

      font-weight: 800;

      color: var(--text-primary);

      margin-bottom: 6px;
    }

    .page-header p {

      color: var(--text-secondary);

      font-size: 0.96rem;
    }

    /* =========================
       GLASS CARD
    ========================= */

    .glass-card {

      background:
        rgba(255,255,255,0.75);

      backdrop-filter:
        blur(14px);

      border:
        1px solid rgba(255,255,255,0.5);

      border-radius: 28px;

      padding: 28px;

      box-shadow:
        0 10px 40px rgba(15,23,42,0.06);

      transition:
        all 0.3s ease;

      overflow: hidden;

      position: relative;
    }

    .glass-card:hover {

      transform:
        translateY(-4px);

      box-shadow:
        0 20px 50px rgba(15,23,42,0.08);
    }

    /* =========================
       SECTION TITLE
    ========================= */

    .section-title {

      position: relative;

      font-size: 1.1rem;

      font-weight: 700;

      margin-bottom: 24px;

      display: flex;

      align-items: center;

      gap: 12px;
    }

    .section-title::before {

      content: '';

      width: 5px;

      height: 22px;

      border-radius: 20px;

      background:
        linear-gradient(
          180deg,
          #4f46e5,
          #7c3aed
        );
    }

    /* =========================
       CLOCK WIDGET
    ========================= */

    .clock-widget {

      position: relative;

      overflow: hidden;

      background:
        linear-gradient(
          135deg,
          rgba(79,70,229,0.08),
          rgba(124,58,237,0.03)
        );

      border:
        1px solid rgba(79,70,229,0.12);

      border-radius: 30px;

      padding: 42px 30px;

      text-align: center;

      backdrop-filter:
        blur(16px);

      box-shadow:
        0 12px 40px rgba(79,70,229,0.08);

      transition:
        all 0.3s ease;
    }

    .clock-widget:hover {

      transform:
        translateY(-4px);

      box-shadow:
        0 20px 50px rgba(79,70,229,0.12);
    }

    .clock-glow {

      position: absolute;

      width: 260px;
      height: 260px;

      background:
        rgba(79,70,229,0.08);

      border-radius: 50%;

      top: -140px;
      right: -120px;

      filter: blur(20px);
    }

    .clock-label {

      position: relative;

      font-size: 0.8rem;

      font-weight: 700;

      letter-spacing: 0.15em;

      color: var(--primary);

      margin-bottom: 18px;
    }

    .time {

      position: relative;

      font-size: 4rem;

      font-weight: 800;

      line-height: 1;

      background:
        linear-gradient(
          135deg,
          #4f46e5,
          #7c3aed
        );

      -webkit-background-clip: text;

      -webkit-text-fill-color: transparent;

      margin-bottom: 14px;
    }

    .date {

      position: relative;

      color: var(--text-secondary);

      font-size: 1rem;

      font-weight: 500;
    }

    /* =========================
       CLOCK BUTTONS
    ========================= */

    .clock-actions {

      display: flex;

      justify-content: center;

      gap: 18px;

      margin-top: 30px;

      flex-wrap: wrap;
    }

    .clock-btn {

      position: relative;

      overflow: hidden;

      border: none;

      color: white;

      padding: 14px 32px;

      border-radius: 18px;

      font-size: 0.95rem;

      font-weight: 700;

      display: flex;

      align-items: center;

      justify-content: center;

      gap: 12px;

      min-width: 170px;

      cursor: pointer;

      transition:
        all 0.28s ease;

      box-shadow:
        0 10px 20px rgba(0,0,0,0.08);
    }

    .clock-btn:hover {

      transform:
        translateY(-3px);

      box-shadow:
        0 18px 30px rgba(0,0,0,0.12);
    }

    .clock-btn:disabled {

      opacity: 0.5;

      cursor: not-allowed;

      transform: none;
    }

    .clock-in {

      background:
        linear-gradient(
          135deg,
          #22c55e,
          #16a34a
        );
    }

    .clock-out {

      background:
        linear-gradient(
          135deg,
          #ef4444,
          #dc2626
        );
    }

    .dot {

      width: 11px;
      height: 11px;

      border-radius: 50%;

      background: rgba(255,255,255,0.95);
    }

    .clock-message {

      margin-top: 18px;

      font-size: 0.9rem;

      font-weight: 500;

      color: var(--text-secondary);
    }

    /* =========================
       INFO ITEMS
    ========================= */

    .info-item,
    .shift-item {

      display: flex;

      justify-content: space-between;

      align-items: center;

      padding: 16px 0;

      border-bottom:
        1px solid rgba(226,232,240,0.8);

      font-size: 0.95rem;
    }

    .info-item:last-child,
    .shift-item:last-child {
      border-bottom: none;
    }

    .info-item span,
    .shift-item span {

      color: var(--text-secondary);

      font-weight: 500;
    }

    .info-item strong,
    .shift-item strong {

      color: var(--text-primary);

      font-weight: 700;
    }

    /* =========================
       BADGES
    ========================= */

    .badge-status {

      padding: 8px 14px;

      border-radius: 999px;

      font-size: 0.78rem;

      font-weight: 700;
    }

    .badge-present {

      background:
        rgba(16,185,129,0.12);

      color:
        #10b981;
    }

    .badge-late {

      background:
        rgba(245,158,11,0.14);

      color:
        #f59e0b;
    }

    .badge-half-day {

      background:
        rgba(249,115,22,0.12);

      color:
        #f97316;
    }

    .badge-absent {

      background:
        rgba(239,68,68,0.12);

      color:
        #ef4444;
    }

    /* =========================
       ANNOUNCEMENTS
    ========================= */

    .announcement-item {

      padding: 18px;

      border-radius: 20px;

      margin-bottom: 14px;

      background:
        rgba(255,255,255,0.7);

      border:
        1px solid rgba(226,232,240,0.7);

      transition:
        all 0.28s ease;
    }

    .announcement-item:hover {

      transform:
        translateY(-3px);

      box-shadow:
        0 14px 30px rgba(15,23,42,0.08);
    }

    .announcement-item h6 {

      font-size: 1rem;

      font-weight: 700;

      margin-bottom: 6px;

      color: var(--text-primary);
    }

    .announcement-item p {

      color: var(--text-secondary);

      line-height: 1.6;

      font-size: 0.88rem;

      margin-bottom: 8px;
    }

    .announcement-item small {

      color: var(--text-secondary);

      font-weight: 600;
    }

    /* =========================
       EMPTY STATE
    ========================= */

    .empty-state {

      text-align: center;

      padding: 40px 0;

      color: var(--text-secondary);
    }

    /* =========================
       ANIMATIONS
    ========================= */

    @keyframes fadeInUp {

      from {
        opacity: 0;
        transform: translateY(20px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.5s ease forwards;
    }

    .delay-1 {
      animation-delay: 0.1s;
      opacity: 0;
    }

    .delay-2 {
      animation-delay: 0.2s;
      opacity: 0;
    }

    .delay-3 {
      animation-delay: 0.3s;
      opacity: 0;
    }

    /* =========================
       RESPONSIVE
    ========================= */

    @media (max-width: 768px) {

      .page-header {
        align-items: stretch;
      }

      .profile-photo-card {
        width: 100%;
        min-width: 0;
      }

      .time {
        font-size: 2.8rem;
      }

      .clock-actions {
        flex-direction: column;
      }

      .clock-btn {
        width: 100%;
      }

      .glass-card,
      .clock-widget {
        padding: 22px;
      }

    }

  `]
})

export class EmpDashboardComponent implements OnInit {

  userName = '';

  profilePicture = '';

  employeeDepartment = '';

  employeeDesignation = '';

  currentTime = '';

  today = new Date();

  isClockedIn = false;

  isClockedOut = false;

  clockMessage = '';

  todayData: any = {};

  announcements: any[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private announcementService: AnnouncementService,
    private timeService: TimeService
  ) {

    this.userName =
      this.authService.getUser()?.name || '';

    this.profilePicture =
      this.authService.getUser()?.profile_picture || '';

    this.employeeDepartment =
      this.authService.getUser()?.department || '';

    this.employeeDesignation =
      this.authService.getUser()?.designation || '';

    this.timeService
      .getAppTime()
      .subscribe(time => {

        this.today = time;

        this.currentTime =
          time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

      });
  }

  ngOnInit() {

    this.authService
      .getProfile()
      .subscribe(profile => {

        this.profilePicture = profile.profile_picture || '';

        this.employeeDepartment = profile.department || '';

        this.employeeDesignation = profile.designation || '';

      });

    this.checkTodayStatus();

    this.announcementService
      .getAll()
      .subscribe(data => {

        this.announcements = data;

      });
  }

  get profileSubtitle(): string {

    return (
      this.employeeDepartment ||
      this.employeeDesignation ||
      'Employee'
    );

  }

  onProfilePictureSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {

      this.clockMessage = 'Please select a valid image file.';

      input.value = '';

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      const image = new Image();

      image.onload = () => {

        const maxSize = 320;

        const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);

        const canvas = document.createElement('canvas');

        canvas.width = Math.round(image.width * scale);

        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext('2d');

        if (!context) return;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const profilePicture = canvas.toDataURL('image/jpeg', 0.82);

        this.profilePicture = profilePicture;

        this.authService
          .updateProfilePicture(profilePicture)
          .subscribe({
            next: () => {

              this.clockMessage = 'Profile picture updated.';

              setTimeout(() => {

                this.clockMessage = '';

              }, 3000);
            },
            error: err => {

              this.clockMessage =
                err.error?.message ||
                'Error updating profile picture.';

              alert(this.clockMessage);
            }
          });
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  checkTodayStatus() {

    this.attendanceService
      .getTodayStatus()
      .subscribe(data => {

        this.todayData = data;

        this.isClockedIn = data.clockedIn;

        this.isClockedOut = data.clockedOut;

      });
  }

  clockIn() {

    this.attendanceService
      .clockIn()
      .subscribe({

        next: (res) => {

          this.clockMessage = res.message;

          this.checkTodayStatus();

          setTimeout(() => {

            this.clockMessage = '';

          }, 3000);

        },

        error: (err) => {

          this.clockMessage =
            err.error?.message ||
            'Error clocking in.';
        }
      });
  }

  clockOut() {

    this.attendanceService
      .clockOut()
      .subscribe({

        next: (res) => {

          this.clockMessage = res.message;

          this.checkTodayStatus();

          setTimeout(() => {

            this.clockMessage = '';

          }, 3000);

        },

        error: (err) => {

          this.clockMessage =
            err.error?.message ||
            'Error clocking out.';
        }
      });
  }
}
