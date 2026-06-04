import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="page-header">

      <div>
        <h2>Team Members</h2>
        <p>View and manage employee information in your team.</p>
      </div>

      <div class="header-stats">

          <div class="mini-stat">
            <span>{{ employees.length }}</span>
            <small>Employees</small>
          </div>

          <div class="mini-stat active">
            <span>{{ activeEmployees }}</span>
            <small>Active</small>
          </div>

        </div>

    </div>

    <!-- SEARCH -->

    <div class="search-wrapper">

      <div class="search-box">

        <span class="search-icon">🔍</span>

        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filter()"
          placeholder="Search employees by name, email, role, department..."
          class="search-input"
        />

      </div>

    </div>

    <!-- EMPLOYEE GRID -->

    <div class="employee-grid">

      <div
        class="employee-card"
        *ngFor="let emp of filtered"
      >

        <!-- TOP -->

        <div class="employee-top">

          <div class="avatar">
            <img
              *ngIf="emp.profile_picture; else managerEmployeeInitial"
              [src]="emp.profile_picture"
              [alt]="emp.name + ' profile picture'"
            />

            <ng-template #managerEmployeeInitial>
              {{ emp.name?.charAt(0) }}
            </ng-template>
          </div>

          <div>

            <h5>{{ emp.name }}</h5>

            <p>{{ emp.role | titlecase }} • {{ emp.designation || 'Employee' }}</p>

          </div>

        </div>

        <!-- BODY -->

        <div class="employee-body">

          <div class="info-item">
            <span>Email</span>
            <strong>{{ emp.email }}</strong>
          </div>

          <div class="info-item">
            <span>Department</span>
            <strong>{{ emp.department || '-' }}</strong>
          </div>

          <div class="info-item">
            <span>Designation</span>
            <strong>{{ emp.designation || '-' }}</strong>
          </div>

          <div class="info-item">
            <span>Phone</span>
            <strong>{{ emp.phone || '-' }}</strong>
          </div>

          <div class="info-item">
            <span>Joined</span>
            <strong>
              {{ emp.date_of_joining | date:'MMM d, y' }}
            </strong>
          </div>

          <div class="info-item">
            <span>Salary</span>
            <strong class="salary-value">
              ₹{{ emp.basic_salary | number }}
            </strong>
          </div>

        </div>

        <!-- FOOTER -->

        <div class="employee-footer">

          <span
            class="status-badge"
            [ngClass]="emp.is_active ? 'active-status' : 'inactive-status'"
          >
            {{ emp.is_active ? 'Active' : 'Inactive' }}
          </span>

          <span class="employee-id">
            #EMP{{ emp._id?.slice(-4)?.toUpperCase() }}
          </span>

        </div>

      </div>

      <!-- EMPTY -->

      <div
        *ngIf="filtered.length === 0"
        class="empty-state"
      >

        <div class="empty-icon">
          👨‍💼
        </div>

        <h4>No Employees Found</h4>

        <p>
          Try changing your search keyword.
        </p>

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

      flex-wrap: wrap;

      margin-bottom: 28px;
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
        HEADER STATS
    ========================== */

    .header-stats {

      display: flex;

      gap: 14px;

      flex-wrap: wrap;
    }

    .mini-stat {

      min-width: 110px;

      padding: 14px 18px;

      border-radius: 20px;

      background: rgba(255,255,255,0.75);

      backdrop-filter: blur(14px);

      border: 1px solid rgba(255,255,255,0.3);

      text-align: center;

      box-shadow:
        0 10px 25px rgba(15,23,42,0.05);
    }

    .mini-stat span {

      display: block;

      font-size: 1.4rem;

      font-weight: 800;

      color: #6366f1;
    }

    .mini-stat small {

      color: #64748b;

      font-weight: 600;
    }

    .mini-stat.active span {

      color: #10b981;
    }

    /* =========================
        SEARCH
    ========================== */

    .search-wrapper {

      margin-bottom: 28px;
    }

    .search-box {

      position: relative;

      max-width: 450px;
    }

    .search-icon {

      position: absolute;

      top: 50%;

      left: 18px;

      transform: translateY(-50%);

      font-size: 0.95rem;

      color: #94a3b8;
    }

    .search-input {

      width: 100%;

      border: none;

      outline: none;

      padding: 16px 18px 16px 48px;

      border-radius: 18px;

      background: rgba(255,255,255,0.75);

      backdrop-filter: blur(14px);

      border: 1px solid rgba(255,255,255,0.3);

      color: #0f172a;

      font-size: 0.95rem;

      transition: all 0.25s ease;

      box-shadow:
        0 10px 25px rgba(15,23,42,0.04);
    }

    .search-input:focus {

      border-color: rgba(99,102,241,0.4);

      box-shadow:
        0 0 0 4px rgba(99,102,241,0.08);
    }

    /* =========================
        EMPLOYEE GRID
    ========================== */

    .employee-grid {

      display: grid;

      grid-template-columns:
        repeat(auto-fit, minmax(320px, 1fr));

      gap: 24px;
    }

    /* =========================
        EMPLOYEE CARD
    ========================== */

    .employee-card {

      background: rgba(255,255,255,0.75);

      backdrop-filter: blur(18px);

      border: 1px solid rgba(255,255,255,0.3);

      border-radius: 28px;

      padding: 24px;

      transition: all 0.3s ease;

      box-shadow:
        0 15px 35px rgba(15,23,42,0.06);

      position: relative;

      overflow: hidden;
    }

    .employee-card::before {

      content: '';

      position: absolute;

      top: 0;

      left: 0;

      width: 100%;

      height: 5px;

      background:
        linear-gradient(90deg,#6366f1,#8b5cf6);
    }

    .employee-card:hover {

      transform: translateY(-6px);

      box-shadow:
        0 25px 45px rgba(15,23,42,0.12);
    }

    /* =========================
        TOP
    ========================== */

    .employee-top {

      display: flex;

      align-items: center;

      gap: 16px;

      margin-bottom: 22px;
    }

    .avatar {

      width: 64px;

      height: 64px;

      border-radius: 20px;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      display: flex;

      align-items: center;

      justify-content: center;

      color: white;

      font-size: 1.3rem;

      font-weight: 800;

      box-shadow:
        0 14px 28px rgba(99,102,241,0.25);

      overflow: hidden;
    }

    .avatar img {

      width: 100%;

      height: 100%;

      object-fit: cover;
    }

    .employee-top h5 {

      margin: 0;

      font-size: 1.1rem;

      font-weight: 800;

      color: #0f172a;
    }

    .employee-top p {

      margin: 4px 0 0;

      color: #64748b;

      font-size: 0.88rem;
    }

    /* =========================
        BODY
    ========================== */

    .employee-body {

      display: flex;

      flex-direction: column;

      gap: 14px;
    }

    .info-item {

      display: flex;

      justify-content: space-between;

      align-items: center;

      gap: 12px;

      padding-bottom: 12px;

      border-bottom:
        1px solid rgba(148,163,184,0.12);
    }

    .info-item:last-child {

      border-bottom: none;

      padding-bottom: 0;
    }

    .info-item span {

      color: #64748b;

      font-size: 0.88rem;

      font-weight: 600;
    }

    .info-item strong {

      color: #0f172a;

      font-size: 0.9rem;

      font-weight: 700;

      text-align: right;

      min-width: 0;

      overflow-wrap: anywhere;
    }

    .salary-value {

      color: #10b981;
    }

    /* =========================
        FOOTER
    ========================== */

    .employee-footer {

      display: flex;

      justify-content: space-between;

      align-items: center;

      margin-top: 24px;
    }

    .status-badge {

      padding: 8px 14px;

      border-radius: 999px;

      font-size: 0.75rem;

      font-weight: 800;
    }

    .active-status {

      background:
        rgba(16,185,129,0.12);

      color: #10b981;
    }

    .inactive-status {

      background:
        rgba(239,68,68,0.12);

      color: #ef4444;
    }

    .employee-id {

      font-size: 0.78rem;

      color: #94a3b8;

      font-weight: 700;
    }

    /* =========================
        EMPTY STATE
    ========================== */

    .empty-state {

      grid-column: 1 / -1;

      text-align: center;

      padding: 80px 20px;

      background: rgba(255,255,255,0.7);

      border-radius: 28px;

      backdrop-filter: blur(18px);
    }

    .empty-icon {

      font-size: 4rem;

      margin-bottom: 16px;
    }

    .empty-state h4 {

      font-weight: 800;

      color: #0f172a;

      margin-bottom: 10px;
    }

    .empty-state p {

      color: #64748b;
    }

    /* =========================
        RESPONSIVE
    ========================== */

    @media (max-width: 768px) {

      .page-header {

        flex-direction: column;

        align-items: flex-start;
      }

      .employee-grid {

        grid-template-columns: 1fr;
      }

      .employee-card {

        padding: 20px;
      }

      .info-item {

        flex-direction: column;

        align-items: flex-start;
      }

      .info-item strong {

        text-align: left;
      }
    }

  `]
})

export class EmployeeViewComponent implements OnInit {

  employees: any[] = [];

  filtered: any[] = [];

  searchTerm = '';

  activeEmployees = 0;

  intervalId: any;

  constructor(
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {

    this.employeeService.getAll().subscribe(data => {

      this.employees = data;

      // compute active employees count
      this.activeEmployees = data.filter((e: any) => e.is_active).length;

      this.filter();

      // start polling for regular updates
      this.startPolling();
    });

  }

  startPolling() {
    this.intervalId = setInterval(() => {
      this.employeeService.getAll().subscribe(d => {
        this.employees = d;
        this.activeEmployees = d.filter((e: any) => e.is_active).length;
        this.filter();
      });
    }, 15000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  filter() {

    const t = this.searchTerm.toLowerCase();

    this.filtered = this.employees.filter(e =>

      e.name.toLowerCase().includes(t) ||

      e.email.toLowerCase().includes(t) ||

      (e.role || '').toLowerCase().includes(t) ||

      (e.department || '')
        .toLowerCase()
        .includes(t) ||

      (e.designation || '')
        .toLowerCase()
        .includes(t) ||

      (e.phone || '')
        .toLowerCase()
        .includes(t)
    );
  }
}
