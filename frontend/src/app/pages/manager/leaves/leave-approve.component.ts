import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';

@Component({
  selector: 'app-leave-approve',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="page-header">
      <div>
        <h2>Leave Approvals</h2>
        <p>Approve or reject employee leave requests.</p>
      </div>

      <div class="leave-stats">
        <div class="mini-stat pending">
          <span>{{ pendingCount }}</span>
          <small>Pending</small>
        </div>

        <div class="mini-stat approved">
          <span>{{ approvedCount }}</span>
          <small>Approved</small>
        </div>

        <div class="mini-stat rejected">
          <span>{{ rejectedCount }}</span>
          <small>Rejected</small>
        </div>
      </div>
    </div>

    <!-- FILTERS -->

    <div class="filter-wrapper">

      <button
        class="filter-btn"
        [class.active]="statusFilter === ''"
        (click)="filterByStatus('')"
      >
        All
      </button>

      <button
        class="filter-btn pending-btn"
        [class.active]="statusFilter === 'pending'"
        (click)="filterByStatus('pending')"
      >
        Pending
      </button>

      <button
        class="filter-btn approved-btn"
        [class.active]="statusFilter === 'approved'"
        (click)="filterByStatus('approved')"
      >
        Approved
      </button>

      <button
        class="filter-btn rejected-btn"
        [class.active]="statusFilter === 'rejected'"
        (click)="filterByStatus('rejected')"
      >
        Rejected
      </button>

    </div>

    <!-- TABLE CARD -->

    <div class="glass-card">

      <div class="table-responsive">

        <table class="table leave-table align-middle">

          <thead>

            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Date Range</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            <tr *ngFor="let leave of leaves">

              <!-- EMPLOYEE -->

              <td>

                <div class="employee-cell">

                  <div class="avatar">
                    {{ leave.name?.charAt(0) }}
                  </div>

                  <div>

                    <div class="emp-name">
                      {{ leave.name }}
                    </div>

                    <small class="emp-sub">
                      Employee Leave
                    </small>

                  </div>

                </div>

              </td>

              <!-- TYPE -->

              <td>

                <span class="leave-type">
                  {{ leave.leave_type | titlecase }}
                </span>

              </td>

              <!-- DATES -->

              <td>

                <div class="date-range">

                  <div>
                    {{ leave.start_date | date:'MMM d, y' }}
                  </div>

                  <small>to</small>

                  <div>
                    {{ leave.end_date | date:'MMM d, y' }}
                  </div>

                </div>

              </td>

              <!-- REASON -->

              <td>

                <div class="reason-box">
                  {{ leave.reason || 'No reason provided' }}
                </div>

              </td>

              <!-- STATUS -->

              <td>

                <span
                  class="status-badge"
                  [ngClass]="leave.status"
                >
                  {{ leave.status | titlecase }}
                </span>

              </td>

              <!-- ACTIONS -->

              <td>

                <div *ngIf="leave.status === 'pending'" class="action-buttons">

                  <button
                    class="approve-btn"
                    (click)="update(leave._id, 'approved')"
                  >
                    ✓ Approve
                  </button>

                  <button
                    class="reject-btn"
                    (click)="update(leave._id, 'rejected')"
                  >
                    ✕ Reject
                  </button>

                </div>

                <div
                  *ngIf="leave.status !== 'pending'"
                  class="approved-by"
                >
                  by {{ leave.approved_by_name || '-' }}
                </div>

              </td>

            </tr>

            <!-- EMPTY -->

            <tr *ngIf="leaves.length === 0">

              <td colspan="6">

                <div class="empty-state">

                  <div class="empty-icon">
                    🌴
                  </div>

                  <h5>No Leave Requests</h5>

                  <p>
                    No leave applications found for this filter.
                  </p>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  `,

  styles: [`

    /* =========================
        PAGE HEADER
    ========================== */

    .page-header {

      display: flex;

      justify-content: space-between;

      align-items: center;

      gap: 20px;

      margin-bottom: 28px;

      flex-wrap: wrap;
    }

    .page-header h2 {

      font-size: 2rem;

      font-weight: 800;

      margin-bottom: 6px;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      -webkit-background-clip: text;

      -webkit-text-fill-color: transparent;
    }

    .page-header p {

      color: #64748b;

      margin: 0;
    }

    /* =========================
        MINI STATS
    ========================== */

    .leave-stats {

      display: flex;

      gap: 14px;

      flex-wrap: wrap;
    }

    .mini-stat {

      min-width: 95px;

      padding: 14px;

      border-radius: 20px;

      text-align: center;

      background: rgba(255,255,255,0.7);

      backdrop-filter: blur(12px);

      border: 1px solid rgba(255,255,255,0.35);

      box-shadow:
        0 10px 25px rgba(15,23,42,0.05);
    }

    .mini-stat span {

      display: block;

      font-size: 1.4rem;

      font-weight: 800;
    }

    .mini-stat small {

      color: #64748b;

      font-weight: 600;
    }

    .pending span {
      color: #f59e0b;
    }

    .approved span {
      color: #10b981;
    }

    .rejected span {
      color: #ef4444;
    }

    /* =========================
        FILTERS
    ========================== */

    .filter-wrapper {

      display: flex;

      gap: 12px;

      margin-bottom: 22px;

      flex-wrap: wrap;
    }

    .filter-btn {

      border: none;

      padding: 12px 22px;

      border-radius: 14px;

      font-weight: 700;

      background: rgba(255,255,255,0.7);

      color: #64748b;

      transition: all 0.25s ease;

      backdrop-filter: blur(12px);

      box-shadow:
        0 10px 20px rgba(15,23,42,0.04);
    }

    .filter-btn:hover {

      transform: translateY(-2px);

      color: #0f172a;
    }

    .filter-btn.active {

      color: white;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      box-shadow:
        0 14px 30px rgba(99,102,241,0.25);
    }

    .pending-btn.active {

      background:
        linear-gradient(135deg,#f59e0b,#f97316);
    }

    .approved-btn.active {

      background:
        linear-gradient(135deg,#10b981,#059669);
    }

    .rejected-btn.active {

      background:
        linear-gradient(135deg,#ef4444,#dc2626);
    }

    /* =========================
        GLASS CARD
    ========================== */

    .glass-card {

      background: rgba(255,255,255,0.72);

      backdrop-filter: blur(18px);

      border: 1px solid rgba(255,255,255,0.35);

      border-radius: 28px;

      padding: 22px;

      box-shadow:
        0 20px 40px rgba(15,23,42,0.08);
    }

    /* =========================
        TABLE
    ========================== */

    .leave-table {

      margin: 0;
    }

    .leave-table thead th {

      border: none;

      padding: 18px;

      color: #64748b;

      font-size: 0.8rem;

      font-weight: 800;

      text-transform: uppercase;

      letter-spacing: 0.5px;

      white-space: nowrap;
    }

    .leave-table tbody td {

      padding: 20px 18px;

      border-top: 1px solid rgba(148,163,184,0.12);

      vertical-align: middle;
    }

    .leave-table tbody tr {

      transition: all 0.25s ease;
    }

    .leave-table tbody tr:hover {

      background:
        rgba(248,250,252,0.8);
    }

    /* =========================
        EMPLOYEE
    ========================== */

    .employee-cell {

      display: flex;

      align-items: center;

      gap: 14px;
    }

    .avatar {

      width: 48px;

      height: 48px;

      border-radius: 16px;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      color: white;

      display: flex;

      align-items: center;

      justify-content: center;

      font-weight: 800;

      font-size: 1rem;

      box-shadow:
        0 10px 25px rgba(99,102,241,0.25);
    }

    .emp-name {

      font-weight: 700;

      color: #0f172a;
    }

    .emp-sub {

      color: #94a3b8;
    }

    /* =========================
        LEAVE TYPE
    ========================== */

    .leave-type {

      background:
        rgba(99,102,241,0.1);

      color: #6366f1;

      padding: 8px 14px;

      border-radius: 999px;

      font-size: 0.78rem;

      font-weight: 700;
    }

    /* =========================
        DATE RANGE
    ========================== */

    .date-range {

      display: flex;

      flex-direction: column;

      gap: 4px;

      font-weight: 600;

      color: #0f172a;
    }

    .date-range small {

      color: #94a3b8;
    }

    /* =========================
        REASON
    ========================== */

    .reason-box {

      max-width: 240px;

      color: #64748b;

      line-height: 1.5;

      font-size: 0.88rem;
    }

    /* =========================
        STATUS
    ========================== */

    .status-badge {

      padding: 9px 16px;

      border-radius: 999px;

      font-size: 0.78rem;

      font-weight: 800;

      text-transform: capitalize;
    }

    .status-badge.pending {

      background:
        rgba(245,158,11,0.12);

      color: #f59e0b;
    }

    .status-badge.approved {

      background:
        rgba(16,185,129,0.12);

      color: #10b981;
    }

    .status-badge.rejected {

      background:
        rgba(239,68,68,0.12);

      color: #ef4444;
    }

    /* =========================
        ACTIONS
    ========================== */

    .action-buttons {

      display: flex;

      gap: 10px;
    }

    .approve-btn,
    .reject-btn {

      border: none;

      padding: 10px 16px;

      border-radius: 12px;

      font-weight: 700;

      font-size: 0.82rem;

      transition: all 0.25s ease;
    }

    .approve-btn {

      background:
        linear-gradient(135deg,#10b981,#059669);

      color: white;

      box-shadow:
        0 10px 20px rgba(16,185,129,0.2);
    }

    .reject-btn {

      background:
        linear-gradient(135deg,#ef4444,#dc2626);

      color: white;

      box-shadow:
        0 10px 20px rgba(239,68,68,0.2);
    }

    .approve-btn:hover,
    .reject-btn:hover {

      transform: translateY(-2px);
    }

    .approved-by {

      font-size: 0.8rem;

      color: #94a3b8;

      font-weight: 600;
    }

    /* =========================
        EMPTY STATE
    ========================== */

    .empty-state {

      text-align: center;

      padding: 70px 20px;
    }

    .empty-icon {

      font-size: 3rem;

      margin-bottom: 14px;
    }

    .empty-state h5 {

      font-weight: 800;

      margin-bottom: 8px;

      color: #0f172a;
    }

    .empty-state p {

      color: #64748b;
    }

    /* =========================
        RESPONSIVE
    ========================== */

    @media (max-width: 992px) {

      .page-header {

        flex-direction: column;

        align-items: flex-start;
      }
    }

    @media (max-width: 768px) {

      .glass-card {

        padding: 14px;
      }

      .filter-wrapper {

        overflow-x: auto;

        flex-wrap: nowrap;
      }

      .filter-btn {

        white-space: nowrap;
      }

      .action-buttons {

        flex-direction: column;
      }

      .reason-box {

        max-width: 160px;
      }
    }

  `]
})

export class LeaveApproveComponent implements OnInit {

  leaves: any[] = [];

  statusFilter = '';

  pendingCount = 0;

  approvedCount = 0;

  rejectedCount = 0;

  constructor(
    private leaveService: LeaveService
  ) {}

  ngOnInit() {

    this.load();
  }

  filterByStatus(status: string) {

    this.statusFilter = status;

    this.load();
  }

  load() {

    this.leaveService
      .getAllLeaves(this.statusFilter)
      .subscribe(data => {

        this.leaves = data;

        this.pendingCount =
          data.filter((l: any) => l.status === 'pending').length;

        this.approvedCount =
          data.filter((l: any) => l.status === 'approved').length;

        this.rejectedCount =
          data.filter((l: any) => l.status === 'rejected').length;
      });
  }

  update(id: string, status: string) {

    this.leaveService
      .updateLeaveStatus(id, status)
      .subscribe(() => this.load());
  }
}