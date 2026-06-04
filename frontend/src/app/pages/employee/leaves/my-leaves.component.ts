import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h2>My Leave Requests</h2>
      <p>Apply for leaves and track your requests.</p>
    </div>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="glass-card animate-fadeInUp">
          <h5 class="section-title">Apply For Leave</h5>
          <form (ngSubmit)="apply()">
            <div class="mb-3">
              <label class="form-label text-secondary small">Leave Type</label>
              <select [(ngModel)]="form.leave_type" name="type" class="form-select form-select-dark" required>
                <option value="casual">Casual Leave</option>
                <option value="government_holiday">Government Holiday</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label text-secondary small">Start Date</label>
              <input type="date" [(ngModel)]="form.start_date" name="start" class="form-control form-control-dark" required />
            </div>
            <div class="mb-3">
              <label class="form-label text-secondary small">End Date</label>
              <input type="date" [(ngModel)]="form.end_date" name="end" class="form-control form-control-dark" required />
            </div>
            <div class="mb-3">
              <label class="form-label text-secondary small">Reason</label>
              <textarea [(ngModel)]="form.reason" name="reason" class="form-control form-control-dark" rows="3" placeholder="Why are you taking leave?" required></textarea>
            </div>
            <button type="submit" class="btn btn-glow w-100" [disabled]="loading">Apply Now</button>
            <div *ngIf="message" class="mt-3 small text-center" [ngClass]="isError ? 'text-danger' : 'text-success'">{{ message }}</div>
          </form>
        </div>
      </div>
      
      <div class="col-lg-8">
        <div class="glass-card animate-fadeInUp delay-1" style="opacity: 0;">
          <h5 class="section-title">My Leave History</h5>
          <div class="table-responsive">
            <table class="table table-dark-custom">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Approved By</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let leave of myLeaves">
                  <td>{{ leave.leave_type | titlecase }}</td>
                  <td>{{ leave.start_date | date:'MMM d' }} - {{ leave.end_date | date:'MMM d, y' }}</td>
                  <td class="small text-secondary">{{ leave.reason }}</td>
                  <td>
                    <span class="badge-status" [ngClass]="'badge-' + leave.status">{{ leave.status | titlecase }}</span>
                  </td>
                  <td class="small">{{ leave.approved_by_name || '-' }}</td>
                </tr>
                <tr *ngIf="myLeaves.length === 0">
                  <td colspan="5" class="text-center py-4 text-secondary">No leave applications found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MyLeavesComponent implements OnInit {
  myLeaves: any[] = [];
  form: any = { leave_type: 'casual' };
  message = '';
  isError = false;
  loading = false;

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.leaveService.getMyLeaves().subscribe(data => this.myLeaves = data);
  }

  apply() {
    this.loading = true;
    this.leaveService.applyLeave(this.form).subscribe({
      next: (res) => {
        this.message = 'Applied successfully!';
        this.isError = false;
        this.loading = false;
        this.form = { leave_type: 'casual' };
        this.load();
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to apply.';
        this.isError = true;
        this.loading = false;
      }
    });
  }
}
