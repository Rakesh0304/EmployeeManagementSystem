import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryService } from '../../../services/salary.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-salary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header d-flex justify-content-between align-items-end">
      <div>
        <h2>My Salary & Payslips</h2>
        <p>View your monthly earnings and download payslips.</p>
      </div>
      <button class="btn btn-glow mb-2" (click)="recalculate()" [disabled]="isCalculating">
        {{ isCalculating ? 'Calculating...' : 'Recalculate Stats' }}
      </button>
    </div>

    <div class="glass-card animate-fadeInUp">
      <div class="table-responsive">
        <table class="table table-dark-custom">
          <thead>
            <tr>
              <th>Month</th>
              <th>Basic Salary</th>
              <th>Working Days</th>
              <th>Present Days</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of salaryHistory">
              <td class="fw-bold">{{ s.month }}</td>
              <td>₹{{ s.basic_salary | number }}</td>
              <td>{{ s.working_days }}</td>
              <td>{{ s.present_days }}</td>
              <td class="text-danger">-₹{{ s.total_deductions | number:'1.2-2' }}</td>
              <td class="fw-bold text-success">₹{{ s.net_salary | number:'1.2-2' }}</td>
              <td>
                <button class="btn btn-sm btn-primary d-flex align-items-center gap-2" (click)="download(s._id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Payslip
                </button>
              </td>
            </tr>
            <tr *ngIf="salaryHistory.length === 0">
              <td colspan="7" class="text-center py-4 text-secondary">No salary records found yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MySalaryComponent implements OnInit {
  salaryHistory: any[] = [];
  isCalculating = false;

  constructor(
    private salaryService: SalaryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.salaryService.getMySalary().subscribe(data => this.salaryHistory = data);
  }

  recalculate() {
    this.isCalculating = true;
    const user = this.authService.getUser();
    const userId = user?._id || user?.id;
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    this.salaryService.calculateSalary(month, userId).subscribe({
      next: () => {
        this.salaryService.getMySalary().subscribe(data => {
          this.salaryHistory = data;
          this.isCalculating = false;
        });
      },
      error: () => this.isCalculating = false
    });
  }

  download(id: string) {
    this.salaryService.downloadPayslip(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
