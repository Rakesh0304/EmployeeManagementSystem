import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryService } from '../../../services/salary.service';

@Component({
  selector: 'app-salary-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h2>Payroll Overview</h2>
      <p>View salary details for your team (read-only).</p>
    </div>

    <div class="glass-card mb-4">
      <div class="d-flex gap-3 flex-wrap align-items-end mb-3">
        <div>
          <label class="form-label" style="color: var(--text-secondary); font-size: 0.8rem;">Month</label>
          <input type="month" [(ngModel)]="selectedMonth" class="form-control form-control-dark" style="width: 200px;" />
        </div>
        <button class="btn btn-glow" (click)="load()">View</button>
      </div>
    </div>

    <div class="glass-card">
      <div class="table-responsive">
        <table class="table table-dark-custom">
          <thead><tr><th>Employee</th><th>Month</th><th>Basic</th><th>Present</th><th>Late</th><th>Deductions</th><th>Net Salary</th><th>Payslip</th></tr></thead>
          <tbody>
            <tr *ngFor="let s of salaries">
              <td class="fw-semibold">{{ s.name }}</td>
              <td>{{ s.month }}</td>
              <td>₹{{ s.basic_salary | number }}</td>
              <td>{{ s.present_days }}</td>
              <td>{{ s.late_days }}</td>
              <td style="color: #ef4444;">-₹{{ s.total_deductions | number:'1.2-2' }}</td>
              <td class="fw-bold" style="color: #10b981;">₹{{ s.net_salary | number:'1.2-2' }}</td>
              <td><button class="btn btn-sm btn-outline-light" (click)="downloadPayslip(s._id)">📄</button></td>
            </tr>
            <tr *ngIf="salaries.length === 0"><td colspan="8" class="text-center py-4" style="color: var(--text-secondary);">No salary data found.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SalaryViewComponent implements OnInit {
  salaries: any[] = [];
  selectedMonth = '';

  constructor(private salaryService: SalaryService) {
    const now = new Date();
    this.selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  ngOnInit() { this.load(); }

  load() { this.salaryService.getSalary(this.selectedMonth).subscribe(data => this.salaries = data); }

  downloadPayslip(id: string) {
    this.salaryService.downloadPayslip(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `payslip_${id}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
