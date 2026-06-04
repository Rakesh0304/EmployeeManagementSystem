import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { AnnouncementService } from '../../../services/announcement.service';
import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="page-header">

      <h2>
        Admin Dashboard
      </h2>

      <p>
        Welcome back! Here's an overview of your organization.
      </p>

    </div>

    <!-- Stats -->

    <div class="row g-4 mb-5">

      <div class="col-xl-3 col-md-6 animate-fadeInUp delay-1">

        <div
          class="stat-card"
          style="background: var(--gradient-1)"
        >

          <div class="stat-icon">
            👥
          </div>

          <div class="stat-value">
            {{ stats.totalEmployees }}
          </div>

          <div class="stat-label">
            Total Employees
          </div>

        </div>

      </div>

      <div class="col-xl-3 col-md-6 animate-fadeInUp delay-2">

        <div
          class="stat-card"
          style="background: var(--gradient-2)"
        >

          <div class="stat-icon">
            👔
          </div>

          <div class="stat-value">
            {{ stats.totalManagers }}
          </div>

          <div class="stat-label">
            Manager
          </div>

        </div>

      </div>

      <div class="col-xl-3 col-md-6 animate-fadeInUp delay-3">

        <div
          class="stat-card"
          style="background: var(--gradient-4)"
        >

          <div class="stat-icon">
            ✅
          </div>

          <div class="stat-value">
            {{ stats.presentToday }}
          </div>

          <div class="stat-label">
            Present Today
          </div>

        </div>

      </div>

      <div class="col-xl-3 col-md-6 animate-fadeInUp delay-4">

        <div
          class="stat-card"
          style="background: var(--gradient-3)"
        >

          <div class="stat-icon">
            📋
          </div>

          <div class="stat-value">
            {{ stats.pendingLeaves }}
          </div>

          <div class="stat-label">
            Pending Leaves
          </div>

        </div>

      </div>

    </div>

    <!-- Main -->

    <div class="row g-4">

      <!-- Announcements -->

      <div class="col-lg-8">

        <div
          class="glass-card animate-fadeInUp"
          style="animation-delay: 0.3s; opacity: 0;"
        >

          <h5 class="section-title">
            Recent Announcements
          </h5>

          <div
            *ngIf="announcements.length === 0"
            class="empty-state"
          >
            No announcements yet.
          </div>

          <div
            *ngFor="let ann of announcements.slice(0, 5)"
            class="announcement-item"
          >

            <div class="d-flex justify-content-between align-items-start">

              <div>

                <h6>
                  {{ ann.title }}
                </h6>

                <p>
                  {{ ann.message }}
                </p>

              </div>

              <span class="announcement-date">

                {{ ann.created_at | date:'MMM d, y' }}

              </span>

            </div>

          </div>

        </div>

      </div>

      <!-- Quick Info -->

      <div class="col-lg-4">

        <div
          class="glass-card animate-fadeInUp"
          style="animation-delay: 0.4s; opacity: 0;"
        >

          <h5 class="section-title">
            Quick Info
          </h5>

          <div class="info-item">

            <span>
              Office Hours
            </span>

            <strong>
              10:00 AM - 7:00 PM
            </strong>

          </div>

          <div class="info-item">

            <span>
              Shift Duration
            </span>

            <strong>
              9 Hours
            </strong>

          </div>

          <div class="info-item">

            <span>
              Today
            </span>

            <strong>
              {{ today | date:'EEEE, MMM d' }}
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
      margin-bottom: 32px;
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
       SECTION TITLE
    ========================= */

    .section-title {

      position: relative;

      font-size: 1.1rem;

      font-weight: 700;

      margin-bottom: 24px;

      color: var(--text-primary);

      display: flex;

      align-items: center;

      gap: 12px;

      z-index: 2;
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

    .glass-card::before {

      content: '';

      position: absolute;

      width: 220px;
      height: 220px;

      background:
        rgba(79,70,229,0.04);

      border-radius: 50%;

      top: -120px;
      right: -100px;

      filter: blur(10px);
    }

    .glass-card:hover {

      transform:
        translateY(-4px);

      box-shadow:
        0 20px 50px rgba(15,23,42,0.08);
    }

    /* =========================
       STAT CARDS
    ========================= */

    .stat-card {

      position: relative;

      overflow: hidden;

      border-radius: 26px;

      padding: 28px;

      color: white;

      box-shadow:
        0 10px 30px rgba(15,23,42,0.08);

      transition:
        all 0.3s ease;
    }

    .stat-card:hover {

      transform:
        translateY(-6px);

      box-shadow:
        0 20px 40px rgba(15,23,42,0.12);
    }

    .stat-card::before {

      content: '';

      position: absolute;

      width: 220px;
      height: 220px;

      border-radius: 50%;

      background:
        rgba(255,255,255,0.08);

      top: -120px;
      right: -100px;
    }

    .stat-icon {

      position: absolute;

      top: 18px;
      right: 20px;

      font-size: 3rem;

      opacity: 0.18;
    }

    .stat-value {

      position: relative;

      font-size: 2.5rem;

      font-weight: 800;

      line-height: 1;
    }

    .stat-label {

      position: relative;

      margin-top: 8px;

      font-size: 0.95rem;

      font-weight: 600;

      opacity: 0.92;
    }

    /* =========================
       ANNOUNCEMENTS
    ========================= */

    .announcement-item {

      position: relative;

      padding: 18px 18px 18px 20px;

      border-radius: 18px;

      margin-bottom: 14px;

      background:
        rgba(255,255,255,0.7);

      border:
        1px solid rgba(226,232,240,0.7);

      backdrop-filter:
        blur(10px);

      transition:
        all 0.28s ease;

      overflow: hidden;
    }

    .announcement-item::before {

      content: '';

      position: absolute;

      left: 0;
      top: 0;

      width: 4px;
      height: 100%;

      background:
        linear-gradient(
          180deg,
          #4f46e5,
          #7c3aed
        );
    }

    .announcement-item:hover {

      transform:
        translateY(-3px);

      box-shadow:
        0 14px 30px rgba(15,23,42,0.08);

      border-color:
        rgba(79,70,229,0.18);
    }

    .announcement-item h6 {

      font-size: 1rem;

      font-weight: 700;

      color: var(--text-primary);

      margin-bottom: 6px;
    }

    .announcement-item p {

      color: var(--text-secondary);

      line-height: 1.6;

      font-size: 0.88rem;

      margin: 0;
    }

    .announcement-date {

      color: var(--text-secondary);

      font-size: 0.75rem;

      white-space: nowrap;

      margin-left: 16px;

      font-weight: 600;
    }

    /* =========================
       QUICK INFO
    ========================= */

    .info-item {

      display: flex;

      justify-content: space-between;

      align-items: center;

      padding: 18px 0;

      border-bottom:
        1px solid rgba(226,232,240,0.8);

      font-size: 0.95rem;

      transition:
        all 0.25s ease;
    }

    .info-item:hover {
      padding-left: 6px;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item span {

      color: var(--text-secondary);

      font-weight: 500;
    }

    .info-item strong {

      color: var(--text-primary);

      font-weight: 700;
    }

    /* =========================
       EMPTY STATE
    ========================= */

    .empty-state {

      text-align: center;

      padding: 40px 0;

      color: var(--text-secondary);

      font-size: 0.95rem;
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

    .delay-4 {
      animation-delay: 0.4s;
      opacity: 0;
    }

    /* =========================
       RESPONSIVE
    ========================= */

    @media (max-width: 768px) {

      .glass-card {
        padding: 22px;
      }

      .stat-card {
        padding: 22px;
      }

      .stat-value {
        font-size: 2rem;
      }

      .announcement-item {
        padding: 16px;
      }

    }

  `]
})

export class AdminDashboardComponent implements OnInit {

  stats = {
    totalEmployees: 0,
    totalManagers: 0,
    presentToday: 0,
    pendingLeaves: 0
  };

  announcements: any[] = [];

  today = new Date();

  constructor(
    private employeeService: EmployeeService,
    private announcementService: AnnouncementService,
    private cdr: ChangeDetectorRef,
    private timeService: TimeService
  ) {

    this.timeService
      .getAppTime()
      .subscribe(time => {

        this.today = time;

        this.cdr.detectChanges();

      });
  }

  ngOnInit() {

    this.employeeService
      .getDashboardStats()
      .subscribe(data => {

        this.stats = data;

        this.cdr.detectChanges();

      });

    this.announcementService
      .getAll()
      .subscribe(data => {

        this.announcements = data;

        this.cdr.detectChanges();

      });
  }
}