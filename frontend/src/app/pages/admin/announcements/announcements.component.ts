import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../../services/announcement.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="page-header">
      <h2>Announcements & Schedule</h2>
      <p>Manage announcements and Saturday working schedule.</p>
    </div>

    <div class="row g-4">

      <!-- LEFT SIDE -->

      <div class="col-lg-7">

        <!-- CREATE ANNOUNCEMENT -->

        <div class="glass-card mb-4">
          <h5 class="section-title">Create Announcement</h5>

          <form (ngSubmit)="createAnnouncement()">

            <div class="mb-3">
              <input
                type="text"
                [(ngModel)]="newAnnouncement.title"
                name="title"
                placeholder="Announcement title"
                class="form-control form-control-custom"
                required
              />
            </div>

            <div class="mb-3">
              <textarea
                [(ngModel)]="newAnnouncement.message"
                name="message"
                placeholder="Announcement message"
                class="form-control form-control-custom"
                rows="4"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn btn-glow"
              [disabled]="isPublishing"
            >
              {{ isPublishing ? 'Publishing...' : 'Publish Announcement' }}
            </button>

            <div
              *ngIf="publishMessage"
              class="alert custom-alert py-2 px-3 mt-3 mb-0"
            >
              {{ publishMessage }}
            </div>

          </form>
        </div>

        <!-- ALL ANNOUNCEMENTS -->

        <div class="glass-card">
          <h5 class="section-title">All Announcements</h5>

          <div
            *ngFor="let ann of announcements"
            class="announcement-card mb-3"
          >

            <div class="d-flex justify-content-between align-items-start">

              <div style="flex: 1;">

                <h6>{{ ann.title }}</h6>

                <p>
                  {{ ann.message }}
                </p>

                <div class="d-flex align-items-center gap-2 mt-3">

                  <div class="user-avatar-sm">
                    {{ ann.created_by_name?.charAt(0) }}
                  </div>

                  <small class="creator-info">
                    {{ ann.created_by_name }}
                    ·
                    {{ ann.created_at | date:'MMM d, y' }}
                  </small>

                </div>
              </div>

              <button
                class="btn btn-sm btn-outline-danger"
                (click)="removeAnnouncement(ann._id)"
              >
                🗑️
              </button>

            </div>
          </div>

          <!-- EMPTY -->

          <div
            *ngIf="announcements.length === 0"
            class="empty-state"
          >
            <div class="empty-icon">📢</div>
            <h6>No announcements yet</h6>
            <p>Create your first announcement.</p>
          </div>

        </div>

      </div>

      <!-- RIGHT SIDE -->

      <div class="col-lg-5">

        <div class="glass-card">

          <h5 class="section-title">Saturday Schedule</h5>

          <form (ngSubmit)="setSaturday()" class="mb-4">

            <div class="mb-3">

              <label class="form-label-custom">
                Select Saturday
              </label>

              <input
                type="date"
                [(ngModel)]="saturdayDate"
                name="satDate"
                class="form-control form-control-custom"
                required
              />

            </div>

            <div class="mb-3">

              <label class="form-label-custom">
                Working Status
              </label>

              <select
                [(ngModel)]="saturdayWorking"
                name="satWorking"
                class="form-select form-select-custom"
              >
                <option [ngValue]="true">
                  Working Saturday
                </option>

                <option [ngValue]="false">
                  Non-working Saturday
                </option>
              </select>

            </div>

            <button
              type="submit"
              class="btn btn-glow w-100"
            >
              Update Schedule
            </button>

          </form>

          <!-- MESSAGE -->

          <div
            *ngIf="satMessage"
            class="alert custom-alert py-2 px-3 mb-4"
          >
            {{ satMessage }}
          </div>

          <!-- SCHEDULE LIST -->

          <div class="schedule-list">

            <div
              *ngFor="let sat of saturdaySchedule"
              class="schedule-item"
            >

              <div
                class="d-flex justify-content-between align-items-center w-100"
              >

                <span class="schedule-date">
                  {{ sat.date | date:'MMM d, y' }}
                </span>

                <span
                  class="badge-status"
                  [ngClass]="sat.is_working ? 'badge-approved' : 'badge-rejected'"
                >
                  {{ sat.is_working ? 'Working' : 'Non-working' }}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  `,

  styles: [`

    /* =========================
        PAGE HEADER
    ========================== */

    .page-header {
      margin-bottom: 28px;
    }

    .page-header h2 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 8px;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .page-header p {
      color: #64748b;
      font-size: 0.96rem;
    }

    /* =========================
        GLASS CARD
    ========================== */

    .glass-card {

      background: rgba(255,255,255,0.72);

      backdrop-filter: blur(18px);

      border: 1px solid rgba(255,255,255,0.35);

      border-radius: 28px;

      padding: 28px;

      box-shadow:
        0 15px 40px rgba(15,23,42,0.08);

      transition: all 0.3s ease;
    }

    .glass-card:hover {

      transform: translateY(-3px);

      box-shadow:
        0 20px 45px rgba(15,23,42,0.12);
    }

    /* =========================
        SECTION TITLE
    ========================== */

    .section-title {

      font-size: 1.15rem;

      font-weight: 800;

      margin-bottom: 22px;

      display: flex;

      align-items: center;

      gap: 12px;

      color: #0f172a;
    }

    .section-title::before {

      content: '';

      width: 5px;

      height: 22px;

      border-radius: 20px;

      background:
        linear-gradient(180deg,#6366f1,#8b5cf6);
    }

    /* =========================
        FORM CONTROLS
    ========================== */

    .form-control-custom,
    .form-select-custom {

      background: rgba(255,255,255,0.88);

      border: 1px solid rgba(148,163,184,0.2);

      border-radius: 16px;

      padding: 14px 16px;

      font-size: 0.92rem;

      transition: all 0.25s ease;
    }

    .form-control-custom:focus,
    .form-select-custom:focus {

      outline: none;

      border-color: #6366f1;

      box-shadow:
        0 0 0 4px rgba(99,102,241,0.12);

      background: white;
    }

    textarea.form-control-custom {
      resize: none;
    }

    .form-label-custom {

      display: block;

      margin-bottom: 8px;

      font-size: 0.85rem;

      font-weight: 700;

      color: #64748b;
    }

    /* =========================
        BUTTONS
    ========================== */

    .btn-glow {

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      border: none;

      color: white;

      padding: 13px 24px;

      border-radius: 16px;

      font-weight: 700;

      transition: all 0.25s ease;

      box-shadow:
        0 14px 30px rgba(99,102,241,0.24);
    }

    .btn-glow:hover {

      transform: translateY(-2px);

      box-shadow:
        0 20px 35px rgba(99,102,241,0.34);
    }

    /* =========================
        ANNOUNCEMENT CARD
    ========================== */

    .announcement-card {

      background: rgba(255,255,255,0.82);

      border: 1px solid rgba(148,163,184,0.12);

      border-radius: 22px;

      padding: 22px;

      transition: all 0.28s ease;

      box-shadow:
        0 10px 25px rgba(15,23,42,0.05);
    }

    .announcement-card:hover {

      transform: translateY(-4px);

      border-color: rgba(99,102,241,0.25);

      box-shadow:
        0 20px 35px rgba(15,23,42,0.08);
    }

    .announcement-card h6 {

      font-size: 1rem;

      font-weight: 800;

      margin-bottom: 10px;

      color: #0f172a;
    }

    .announcement-card p {

      color: #64748b;

      line-height: 1.6;

      margin-bottom: 12px;
    }

    /* =========================
        USER AVATAR
    ========================== */

    .user-avatar-sm {

      width: 34px;

      height: 34px;

      border-radius: 10px;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      color: white;

      display: flex;

      align-items: center;

      justify-content: center;

      font-size: 0.85rem;

      font-weight: 800;

      box-shadow:
        0 6px 16px rgba(99,102,241,0.25);
    }

    .creator-info {

      color: #64748b;

      font-weight: 600;
    }

    /* =========================
        DELETE BUTTON
    ========================== */

    .btn-outline-danger {

      width: 42px;

      height: 42px;

      border-radius: 14px;

      background: rgba(239,68,68,0.1);

      border: none;

      transition: all 0.25s ease;
    }

    .btn-outline-danger:hover {

      transform: scale(1.08);

      background: rgba(239,68,68,0.18);
    }

    /* =========================
        ALERT
    ========================== */

    .custom-alert {

      background:
        linear-gradient(135deg,#dbeafe,#ede9fe);

      border: none;

      color: #4338ca;

      font-weight: 600;

      border-radius: 14px;
    }

    /* =========================
        SCHEDULE LIST
    ========================== */

    .schedule-list {

      display: flex;

      flex-direction: column;

      gap: 14px;
    }

    .schedule-item {

      background: rgba(255,255,255,0.85);

      border: 1px solid rgba(148,163,184,0.12);

      border-radius: 18px;

      padding: 16px 18px;

      transition: all 0.25s ease;

      box-shadow:
        0 8px 20px rgba(15,23,42,0.04);
    }

    .schedule-item:hover {

      transform: translateY(-3px);

      box-shadow:
        0 15px 30px rgba(15,23,42,0.08);
    }

    .schedule-date {

      font-weight: 700;

      color: #0f172a;
    }

    /* =========================
        BADGES
    ========================== */

    .badge-status {

      padding: 8px 14px;

      border-radius: 999px;

      font-size: 0.75rem;

      font-weight: 700;
    }

    .badge-approved {

      background: rgba(16,185,129,0.14);

      color: #10b981;
    }

    .badge-rejected {

      background: rgba(239,68,68,0.14);

      color: #ef4444;
    }

    /* =========================
        EMPTY STATE
    ========================== */

    .empty-state {

      text-align: center;

      padding: 60px 20px;
    }

    .empty-icon {

      font-size: 3rem;

      margin-bottom: 16px;

      animation: floatIcon 2.5s ease-in-out infinite;
    }

    .empty-state h6 {

      font-weight: 700;

      margin-bottom: 8px;

      color: #0f172a;
    }

    .empty-state p {

      color: #64748b;
    }

    /* =========================
        ANIMATION
    ========================== */

    @keyframes floatIcon {

      0% {
        transform: translateY(0px);
      }

      50% {
        transform: translateY(-6px);
      }

      100% {
        transform: translateY(0px);
      }
    }

    /* =========================
        RESPONSIVE
    ========================== */

    @media (max-width: 768px) {

      .glass-card {
        padding: 20px;
      }

      .announcement-card {
        padding: 18px;
      }

      .page-header h2 {
        font-size: 1.6rem;
      }
    }

  `]
})

export class AnnouncementsComponent implements OnInit {

  announcements: any[] = [];

  newAnnouncement = {
    title: '',
    message: ''
  };

  saturdayDate = '';

  saturdayWorking = true;

  satMessage = '';

  publishMessage = '';

  isPublishing = false;

  saturdaySchedule: any[] = [];

  constructor(
    private announcementService: AnnouncementService
  ) {}

  ngOnInit() {

    this.loadAnnouncements();

    this.loadSaturdaySchedule();
  }

  loadAnnouncements() {

    this.announcementService
      .getAll()
      .subscribe(data => this.announcements = data);
  }

  createAnnouncement() {
    if (!this.newAnnouncement.title?.trim() || !this.newAnnouncement.message?.trim()) {
      return;
    }

    this.isPublishing = true;
    this.publishMessage = '';

    this.announcementService
      .create(this.newAnnouncement)
      .subscribe({
        next: (res) => {
          this.isPublishing = false;
          this.newAnnouncement = { title: '', message: '' };
          this.loadAnnouncements();

          const emails = res.emails;
          if (emails?.skipped) {
            this.publishMessage =
              'Announcement published. Configure SMTP in backend .env to email employees.';
          } else if (emails) {
            this.publishMessage = `Announcement published. Email sent to ${emails.sent} employee(s).`;
            if (emails.failed > 0) {
              this.publishMessage += ` ${emails.failed} failed.`;
            }
          } else {
            this.publishMessage = 'Announcement published successfully.';
          }

          setTimeout(() => (this.publishMessage = ''), 5000);
        },
        error: (err) => {
          this.isPublishing = false;
          this.publishMessage =
            err.error?.message || 'Failed to publish announcement.';
          setTimeout(() => (this.publishMessage = ''), 5000);
        }
      });
  }

  removeAnnouncement(id: string) {

    this.announcementService
      .remove(id)
      .subscribe(() => this.loadAnnouncements());
  }

  loadSaturdaySchedule() {

    this.announcementService
      .getSaturdaySchedule()
      .subscribe(data => this.saturdaySchedule = data);
  }

  setSaturday() {

    this.announcementService
      .setSaturdaySchedule(
        this.saturdayDate,
        this.saturdayWorking
      )
      .subscribe({

        next: (res) => {

          this.satMessage = res.message;

          this.loadSaturdaySchedule();

          setTimeout(() => {
            this.satMessage = '';
          }, 3000);
        },

        error: (err) => {

          this.satMessage =
            err.error?.message ||
            'Error updating schedule.';
        }
      });
  }
}