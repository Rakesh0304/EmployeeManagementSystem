import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';

@Component({
  selector: 'app-leave-manage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h2>Leave Management</h2>
      <p>Review and manage all leave requests.</p>
    </div>

    <div class="d-flex gap-2 mb-4">
      <button class="btn" [ngClass]="statusFilter === '' ? 'btn-glow' : 'btn-outline-secondary'" (click)="filterByStatus('')">All</button>
      <button class="btn" [ngClass]="statusFilter === 'pending' ? 'btn-glow' : 'btn-outline-secondary'" (click)="filterByStatus('pending')">Pending</button>
      <button class="btn" [ngClass]="statusFilter === 'approved' ? 'btn-glow' : 'btn-outline-secondary'" (click)="filterByStatus('approved')">Approved</button>
      <button class="btn" [ngClass]="statusFilter === 'rejected' ? 'btn-glow' : 'btn-outline-secondary'" (click)="filterByStatus('rejected')">Rejected</button>
    </div>

    <div class="glass-card">
      <div class="table-responsive">
        <table class="table table-custom">
          <thead>
            <tr>
              <th>Employees</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let leave of leaves">
              <td class="fw-semibold">{{ leave.name }}</td>
              <td>{{ leave.leave_type | titlecase }}</td>
              <td>{{ leave.start_date | date:'MMM d, y' }}</td>
              <td>{{ leave.end_date | date:'MMM d, y' }}</td>
              <td style="max-width: 200px; color: var(--text-secondary); font-size: 0.85rem;">{{ leave.reason || '-' }}</td>
              <td>
                <span class="badge-status" [ngClass]="'badge-' + leave.status">{{ leave.status | titlecase }}</span>
              </td>
              <td>
                <div *ngIf="leave.status === 'pending'" class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-success px-3" (click)="updateStatus(leave._id, 'approved')">Approve</button>
                  <button class="btn btn-sm btn-outline-danger px-3" (click)="updateStatus(leave._id, 'rejected')">Reject</button>
                </div>
                <span *ngIf="leave.status !== 'pending'" class="text-secondary small font-weight-bold">
                  {{ leave.status | uppercase }}
                </span>
              </td>
            </tr>
            <tr *ngIf="leaves.length === 0">
              <td colspan="7" class="text-center py-4" style="color: var(--text-secondary);">No leave requests found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class LeaveManageComponent implements OnInit {
  leaves: any[] = [];
  statusFilter = '';

  constructor(private leaveService: LeaveService) {}

  ngOnInit() { this.loadLeaves(); }

  filterByStatus(status: string) {
    this.statusFilter = status;
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getAllLeaves(this.statusFilter).subscribe(data => this.leaves = data);
  }

  updateStatus(id: string, status: string) {
    this.leaveService.updateLeaveStatus(id, status).subscribe(() => this.loadLeaves());
  }
}
