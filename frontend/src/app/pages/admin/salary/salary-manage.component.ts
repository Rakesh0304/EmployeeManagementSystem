import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryService } from '../../../services/salary.service';

@Component({
  selector: 'app-salary-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    
    <div class="page-header">
      <h2>Salary & Payroll</h2>
      <p>Manage employee payroll, salary deductions and payslips.</p>
    </div>

    <!-- TOP STATS -->

    <div class="row g-4 mb-4">

      <div class="col-xl-3 col-md-6">
        <div class="salary-stat-card gradient-purple animate-fadeInUp">

          <div class="salary-icon">💰</div>

          <div class="salary-value">
            ₹{{ getTotalPayroll() | number:'1.0-0' }}
          </div>

          <div class="salary-label">
            Total Payroll
          </div>

        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="salary-stat-card gradient-blue animate-fadeInUp delay-1">

          <div class="salary-icon">👨‍💼</div>

          <div class="salary-value">
            {{ salaries.length }}
          </div>

          <div class="salary-label">
            Employees Paid
          </div>

        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="salary-stat-card gradient-green animate-fadeInUp delay-2">

          <div class="salary-icon">📈</div>

          <div class="salary-value">
            ₹{{ getHighestSalary() | number:'1.0-0' }}
          </div>

          <div class="salary-label">
            Highest Salary
          </div>

        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="salary-stat-card gradient-orange animate-fadeInUp delay-3">

          <div class="salary-icon">📄</div>

          <div class="salary-value">
            {{ selectedMonth }}
          </div>

          <div class="salary-label">
            Payroll Month
          </div>

        </div>
      </div>

    </div>

    <!-- CONTROLS -->

    <div class="glass-card mb-4">

      <div class="salary-toolbar">

        <div class="salary-filter">

          <label>
            Select Month
          </label>

          <input
            type="month"
            [(ngModel)]="selectedMonth"
            class="form-control form-control-custom"
          />

        </div>

        <div class="salary-actions">

          <button
            class="btn btn-glow"
            (click)="calculateSalary()"
          >
            ⚡ Calculate Salary
          </button>

          <button
            class="btn btn-refresh"
            (click)="loadSalaries()"
          >
            ↻ Refresh
          </button>

        </div>

      </div>

      <div
        *ngIf="message"
        class="salary-message"
      >
        {{ message }}
      </div>

    </div>

    <!-- TABLE -->

    <div class="glass-card">

      <div class="table-responsive">

        <table class="salary-table">

          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Basic</th>
              <th>Attendance</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Payslip</th>
            </tr>
          </thead>

          <tbody>

            <tr *ngFor="let s of salaries">

              <!-- EMPLOYEE -->

              <td>

                <div class="employee-box">

                  <div class="employee-avatar">
                    {{ s.name?.charAt(0) }}
                  </div>

                  <div>

                    <div class="employee-name">
                      {{ s.name }}
                    </div>

                    <div class="employee-role">
                      Working: {{ s.working_days }} days
                    </div>

                  </div>

                </div>

              </td>

              <!-- MONTH -->

              <td>
                <span class="month-pill">
                  {{ s.month }}
                </span>
              </td>

              <!-- BASIC -->

              <td>
                <div class="salary-amount">
                  ₹{{ s.basic_salary | number }}
                </div>
              </td>

              <!-- ATTENDANCE -->

              <td>

                <div class="attendance-row">

                  <div class="attendance-mini">
                    ✅ {{ s.present_days }}
                  </div>

                  <div class="attendance-mini warning">
                    ⏰ {{ s.half_days }}
                  </div>

                </div>

              </td>

              <!-- DEDUCTIONS -->

              <td>

                <div class="deduction-box">
                  -₹{{ s.total_deductions | number:'1.2-2' }}
                </div>

              </td>

              <!-- NET -->

              <td>

                <div class="net-salary">
                  ₹{{ s.net_salary | number:'1.2-2' }}
                </div>

              </td>

              <!-- STATUS -->

              <td>

                <span class="salary-status status-paid">
                  Paid
                </span>

              </td>

              <!-- PDF -->

              <td>

                <button
                  class="download-btn"
                  (click)="downloadPayslip(s._id)"
                >
                  📄 Download
                </button>

              </td>

            </tr>

            <tr *ngIf="salaries.length === 0">

              <td colspan="8">

                <div class="empty-state">

                  <div class="empty-icon">
                    💼
                  </div>

                  <h4>No Salary Records</h4>

                  <p>
                    Select a month and calculate payroll.
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

    /* TOP CARDS */

    .salary-stat-card {

      position: relative;

      overflow: hidden;

      border-radius: 28px;

      padding: 28px;

      color: white;

      min-height: 170px;

      transition: all 0.3s ease;

      box-shadow:
        0 18px 35px rgba(15,23,42,0.08);
    }

    .salary-stat-card:hover {

      transform: translateY(-8px) scale(1.02);
    }

    .salary-stat-card::before {

      content: '';

      position: absolute;

      width: 180px;
      height: 180px;

      border-radius: 50%;

      background: rgba(255,255,255,0.12);

      top: -70px;
      right: -70px;
    }

    .gradient-purple {
      background: linear-gradient(135deg,#7c3aed,#6366f1);
    }

    .gradient-blue {
      background: linear-gradient(135deg,#2563eb,#06b6d4);
    }

    .gradient-green {
      background: linear-gradient(135deg,#059669,#10b981);
    }

    .gradient-orange {
      background: linear-gradient(135deg,#ea580c,#f59e0b);
    }

    .salary-icon {

      position: absolute;

      top: 18px;
      right: 20px;

      font-size: 3rem;

      opacity: 0.18;
    }

    .salary-value {

      font-size: 2.3rem;

      font-weight: 900;
    }

    .salary-label {

      margin-top: 10px;

      font-size: 0.95rem;
    }

    /* TOOLBAR */

    .salary-toolbar {

      display: flex;
      justify-content: space-between;
      align-items: end;

      gap: 20px;

      flex-wrap: wrap;
    }

    .salary-filter label {

      display: block;

      margin-bottom: 8px;

      font-size: 0.85rem;

      font-weight: 700;

      color: var(--text-secondary);
    }

    .salary-actions {

      display: flex;
      gap: 12px;
    }

    .btn-refresh {

      border: none;

      background: rgba(99,102,241,0.1);

      color: var(--primary);

      padding: 12px 20px;

      border-radius: 14px;

      font-weight: 700;
    }

    .salary-message {

      margin-top: 20px;

      background: rgba(99,102,241,0.1);

      color: var(--primary);

      padding: 14px 18px;

      border-radius: 14px;

      font-weight: 600;
    }

    /* TABLE */

    .salary-table {

      width: 100%;

      border-collapse: separate;

      border-spacing: 0 14px;
    }

    .salary-table thead th {

      border: none;

      padding: 0 18px 14px;

      font-size: 0.78rem;

      color: #94a3b8;

      text-transform: uppercase;

      letter-spacing: 1px;
    }

    .salary-table tbody tr {

      background: rgba(255,255,255,0.75);

      backdrop-filter: blur(16px);

      transition: all 0.3s ease;

      box-shadow:
        0 10px 25px rgba(15,23,42,0.05);
    }

    .salary-table tbody tr:hover {

      transform: scale(1.01);

      box-shadow:
        0 18px 35px rgba(15,23,42,0.1);
    }

    .salary-table tbody td {

      padding: 22px 18px;

      vertical-align: middle;

      border: none;
    }

    .salary-table tbody tr td:first-child {
      border-radius: 20px 0 0 20px;
    }

    .salary-table tbody tr td:last-child {
      border-radius: 0 20px 20px 0;
    }

    /* EMPLOYEE */

    .employee-box {

      display: flex;
      align-items: center;

      gap: 14px;
    }

    .employee-avatar {

      width: 48px;
      height: 48px;

      border-radius: 50%;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      display: flex;
      align-items: center;
      justify-content: center;

      color: white;

      font-weight: 800;
    }

    .employee-name {

      font-weight: 700;

      color: var(--text-primary);
    }

    .employee-role {

      margin-top: 4px;

      font-size: 0.82rem;

      color: var(--text-secondary);
    }

    /* MONTH */

    .month-pill {

      background: rgba(99,102,241,0.1);

      color: var(--primary);

      padding: 8px 14px;

      border-radius: 999px;

      font-weight: 700;

      font-size: 0.8rem;
    }

    /* ATTENDANCE */

    .attendance-row {

      display: flex;
      gap: 10px;
    }

    .attendance-mini {

      background: rgba(16,185,129,0.12);

      color: #059669;

      padding: 8px 12px;

      border-radius: 12px;

      font-size: 0.8rem;

      font-weight: 700;
    }

    .attendance-mini.warning {

      background: rgba(245,158,11,0.12);

      color: #d97706;
    }

    /* DEDUCTIONS */

    .deduction-box {

      color: #ef4444;

      font-weight: 700;
    }

    /* NET */

    .net-salary {

      font-size: 1.05rem;

      font-weight: 900;

      color: var(--success);
    }

    /* STATUS */

    .salary-status {

      padding: 8px 14px;

      border-radius: 999px;

      font-size: 0.78rem;

      font-weight: 700;
    }

    .status-paid {

      background: rgba(16,185,129,0.14);

      color: #059669;
    }

    /* DOWNLOAD */

    .download-btn {

      border: none;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      color: white;

      padding: 10px 16px;

      border-radius: 14px;

      font-size: 0.82rem;

      font-weight: 700;

      transition: all 0.25s ease;
    }

    .download-btn:hover {

      transform: translateY(-2px);
    }

    /* EMPTY */

    .empty-state {

      text-align: center;

      padding: 40px;
    }

    .empty-icon {

      font-size: 4rem;

      margin-bottom: 16px;
    }

    .empty-state h4 {

      font-weight: 800;

      margin-bottom: 8px;
    }

    .empty-state p {

      color: var(--text-secondary);
    }

    /* MOBILE */

    @media (max-width: 768px) {

      .salary-toolbar {

        flex-direction: column;
        align-items: stretch;
      }

      .salary-actions {

        width: 100%;
      }

      .salary-actions button {

        flex: 1;
      }

      .salary-table {

        min-width: 1100px;
      }
    }
  `]
})

export class SalaryManageComponent implements OnInit {

  salaries: any[] = [];

  selectedMonth = '';

  message = '';

  constructor(private salaryService: SalaryService) {

    const now = new Date();

    this.selectedMonth =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  ngOnInit() {

    this.loadSalaries();
  }

  loadSalaries() {

    this.salaryService
      .getSalary(this.selectedMonth)
      .subscribe(data => this.salaries = data);
  }

  calculateSalary() {

    this.message = 'Calculating payroll...';

    this.salaryService
      .calculateSalary(this.selectedMonth)
      .subscribe({

        next: () => {

          this.message = 'Salary calculated successfully!';

          this.loadSalaries();

          setTimeout(() => {
            this.message = '';
          }, 3000);
        },

        error: (err) => {

          this.message =
            err.error?.message || 'Error calculating salary.';
        }
      });
  }

  downloadPayslip(id: string) {

    this.salaryService
      .downloadPayslip(id)
      .subscribe(blob => {

        const url =
          window.URL.createObjectURL(blob);

        const a =
          document.createElement('a');

        a.href = url;

        a.download = `payslip_${id}.pdf`;

        a.click();

        window.URL.revokeObjectURL(url);
      });
  }

  getTotalPayroll(): number {

    return this.salaries.reduce(
      (sum, s) => sum + (s.net_salary || 0),
      0
    );
  }

  getHighestSalary(): number {

    if (!this.salaries.length) return 0;

    return Math.max(
      ...this.salaries.map(s => s.net_salary || 0)
    );
  }
}