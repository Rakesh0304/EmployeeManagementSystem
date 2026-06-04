import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="page-header">
      <div>
        <h2>Employee Management <small class="muted">({{ employees.length }})</small></h2>
        <p>Create, update, and manage employees and managers.</p>
      </div>

      <button class="btn btn-glow add-btn" (click)="openModal()">
        + Add Employee
      </button>
    </div>

    <div class="glass-card">

      <div class="toolbar">

        <div class="search-box">
          <span class="search-icon">🔍</span>

          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="filterEmployees()"
            placeholder="Search employee..."
            class="form-control-custom"
          />
        </div>

        <button
          class="refresh-btn"
          (click)="loadEmployees()"
          title="Refresh"
        >
          ↻
        </button>

      </div>

      <div class="table-responsive">

        <table class="table-custom">

          <thead>
            <tr>
              <th>Employees</th>
              <th class="center-cell">Role</th>
              <th class="center-cell">Department</th>
              <th class="center-cell">Designation</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr *ngFor="let emp of filtered">

              <td>

                <div class="employee-info">

                  <div class="avatar">
                    <img
                      *ngIf="emp.profile_picture; else adminEmployeeInitial"
                      [src]="emp.profile_picture"
                      [alt]="emp.name + ' profile picture'"
                    />

                    <ng-template #adminEmployeeInitial>
                      {{ emp.name?.charAt(0) }}
                    </ng-template>
                  </div>

                  <div>
                    <div class="emp-name">
                      {{ emp.name }}
                    </div>

                    <div class="emp-email">
                      Mail ID: {{ emp.email }}
                    </div>
                  </div>

                </div>

              </td>

              <td class="center-cell">
                <span
                  class="badge-status"
                  [ngClass]="'badge-' + emp.role"
                >
                  {{ emp.role | titlecase }}
                </span>
              </td>

              <td>
                {{ emp.department || '—' }}
              </td>

              <td>
                {{ emp.designation || '—' }}
              </td>

              <td class="salary">
                ₹{{ emp.basic_salary | number }}
              </td>

              <td>

                <span
                  class="badge-status"
                  [ngClass]="emp.is_active ? 'badge-active' : 'badge-inactive'"
                >
                  {{ emp.is_active ? 'Active' : 'Inactive' }}
                </span>

              </td>

              <td>

                <div class="action-buttons">

                  <button
                    class="action-btn edit-btn"
                    (click)="editEmployee(emp)"
                    title="Edit Employee"
                  >
                    ✏️
                  </button>

                  <button
                    class="action-btn delete-btn"
                    (click)="deleteEmployee(emp._id)"
                    title="Delete Employee"
                  >
                    🗑️
                  </button>

                </div>

              </td>

            </tr>

            <tr *ngIf="filtered.length === 0">

              <td colspan="7" class="empty-state">

                <div class="empty-box">
                  <div class="empty-icon">👨‍💼</div>
                  <h4>No Employees Found</h4>
                  <p>Try adding employees or changing search.</p>
                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

    <!-- MODAL -->

    <div
      class="modal-overlay"
      *ngIf="showModal"
      (click)="closeModal()"
    >

      <div
        class="modal-box"
        (click)="$event.stopPropagation()"
      >

        <div class="modal-header-custom">

          <div>
            <h5>
              {{ isEditing ? 'Edit Employee' : 'Add Employee' }}
            </h5>

            <p>
              Manage employee details and access.
            </p>
          </div>

          <button
            class="btn-close-custom"
            (click)="closeModal()"
          >
            ✕
          </button>

        </div>

        <form
          (ngSubmit)="saveEmployee()"
          class="modal-body-custom"
          autocomplete="off"
        >

          <div class="row g-4">

            <div class="col-md-6">
              <label>Full Name *</label>

              <input
                type="text"
                [(ngModel)]="form.name"
                name="name"
                class="form-control-custom"
                autocomplete="off"
                required
              />
            </div>

            <div class="col-md-6">
              <label>Email *</label>

              <input
                type="email"
                [(ngModel)]="form.email"
                name="email"
                class="form-control-custom"
                autocomplete="off"
                required
              />
            </div>

            <div class="col-md-6" *ngIf="!isEditing">

              <label>Password *</label>

              <input
                type="password"
                [(ngModel)]="form.password"
                name="password"
                class="form-control-custom"
                autocomplete="new-password"
                required
              />
            </div>

            <div class="col-md-6">

              <label>Role</label>

              <select
                [(ngModel)]="form.role"
                name="role"
                class="form-control-custom"
              >
                <option value="" disabled selected hidden></option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>

            </div>

            <div class="col-md-6">

              <label>Phone</label>

              <input
                type="text"
                [(ngModel)]="form.phone"
                name="phone"
                class="form-control-custom"
              />
            </div>

            <div class="col-md-6">

              <label>Department</label>

              <input
                type="text"
                [(ngModel)]="form.department"
                name="department"
                class="form-control-custom"
              />
            </div>

            <div class="col-md-6">

              <label>Designation</label>

              <input
                type="text"
                [(ngModel)]="form.designation"
                name="designation"
                class="form-control-custom"
              />
            </div>

            <div class="col-md-6">

              <label>Blood Group</label>

              <select
                [(ngModel)]="form.blood_group"
                name="blood_group"
                class="form-control-custom"
              >
                <option value="" disabled selected hidden></option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div class="col-md-12">

              <label>Address</label>

              <textarea
                [(ngModel)]="form.address"
                name="address"
                rows="3"
                class="form-control-custom"
              ></textarea>
            </div>

            <div class="col-md-6">

              <label>Basic Salary</label>

              <input
                type="number"
                [(ngModel)]="form.basic_salary"
                name="basic_salary"
                class="form-control-custom"
              />
            </div>

            <div class="col-md-6">

              <label>Date of Joining</label>

              <input
                type="date"
                [(ngModel)]="form.date_of_joining"
                name="date_of_joining"
                class="form-control-custom"
              />

            </div>

          </div>

          <div class="modal-footer-custom">

            <button
              type="button"
              class="cancel-btn"
              (click)="closeModal()"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="btn btn-glow"
            >
              {{ isEditing ? 'Update Employee' : 'Create Employee' }}
            </button>

          </div>

        </form>

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

      margin-bottom: 24px;

      flex-wrap: wrap;

      gap: 16px;
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
        GLASS CARD
    ========================== */

    .glass-card {

      background: rgba(255,255,255,0.72);

      backdrop-filter: blur(20px);

      border-radius: 28px;

      padding: 28px;

      border: 1px solid rgba(255,255,255,0.3);

      box-shadow:
        0 15px 40px rgba(15,23,42,0.08);
    }

    /* =========================
        TOOLBAR
    ========================== */

    .toolbar {

      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 16px;

      margin-bottom: 24px;

      flex-wrap: wrap;
    }

    .search-box {

      position: relative;

      width: 320px;

      max-width: 100%;
    }

    .search-icon {

      position: absolute;

      top: 50%;

      left: 14px;

      transform: translateY(-50%);

      opacity: 0.6;
    }

    /* =========================
        FORM CONTROLS
    ========================== */

    .form-control-custom {

      width: 100%;

      border: 1px solid rgba(148,163,184,0.2);

      background: rgba(255,255,255,0.9);

      border-radius: 16px;

      padding: 13px 16px 13px 42px;

      font-size: 0.92rem;

      transition: all 0.25s ease;
    }

    select.form-control-custom {

      padding-left: 16px;
    }

    .form-control-custom:focus {

      outline: none;

      border-color: #6366f1;

      box-shadow:
        0 0 0 4px rgba(99,102,241,0.12);
    }

    /* =========================
        BUTTONS
    ========================== */

    .btn-glow {

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      border: none;

      color: white;

      border-radius: 16px;

      padding: 12px 24px;

      font-weight: 700;

      transition: all 0.25s ease;

      box-shadow:
        0 14px 30px rgba(99,102,241,0.22);
    }

    .btn-glow:hover {

      transform: translateY(-2px);

      box-shadow:
        0 20px 35px rgba(99,102,241,0.32);
    }

    .refresh-btn {

      border: none;

      width: 46px;

      height: 46px;

      border-radius: 14px;

      background: rgba(99,102,241,0.1);

      color: #6366f1;

      font-size: 1.1rem;

      transition: 0.25s ease;
    }

    .refresh-btn:hover {

      transform: rotate(180deg);

      background: rgba(99,102,241,0.18);
    }

    /* =========================
        TABLE
    ========================== */

    .table-custom {

      width: 100%;

      border-collapse: separate;

      border-spacing: 0 14px;
    }

    .table-custom thead th {

      border: none;

      color: #94a3b8;

      font-size: 0.78rem;

      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 1px;

      padding: 0 18px 14px;
    }

    .table-custom tbody tr {

      background: rgba(255,255,255,0.92);

      transition: all 0.25s ease;

      box-shadow:
        0 10px 25px rgba(15,23,42,0.05);
    }

    .table-custom tbody tr:hover {

      transform: translateY(-4px);

      box-shadow:
        0 20px 35px rgba(15,23,42,0.08);
    }

    .table-custom tbody td {

      padding: 22px 18px;

      border: none;

      vertical-align: middle;
    }

    .center-cell,
    .table-custom thead th:nth-child(3),
    .table-custom thead th:nth-child(4),
    .table-custom tbody td:nth-child(3),
    .table-custom tbody td:nth-child(4) {

      text-align: center;
    }

    .table-custom tbody tr td:first-child {

      border-radius: 20px 0 0 20px;
    }

    .table-custom tbody tr td:last-child {

      border-radius: 0 20px 20px 0;
    }

    /* =========================
        EMPLOYEE INFO
    ========================== */

    .employee-info {

      display: flex;

      align-items: center;

      gap: 14px;
    }

    .avatar {

      width: 50px;

      height: 50px;

      border-radius: 50%;

      background:
        linear-gradient(135deg,#6366f1,#8b5cf6);

      display: flex;

      align-items: center;

      justify-content: center;

      color: white;

      font-weight: 700;

      font-size: 1rem;

      box-shadow:
        0 8px 20px rgba(99,102,241,0.3);

      overflow: hidden;
    }

    .avatar img {

      width: 100%;

      height: 100%;

      object-fit: cover;
    }

    .emp-name {

      font-weight: 700;

      color: #0f172a;

      margin-bottom: 3px;
    }

    .emp-email {

      color: #64748b;

      font-size: 0.84rem;
    }

    /* =========================
        BADGES
    ========================== */

    .badge-status {

      padding: 8px 14px;

      border-radius: 999px;

      font-size: 0.76rem;

      font-weight: 700;
    }

    .badge-admin {

      background: rgba(239,68,68,0.14);

      color: #ef4444;
    }

    .badge-manager {

      background: rgba(245,158,11,0.14);

      color: #f59e0b;
    }

    .badge-employee {

      background: rgba(16,185,129,0.14);

      color: #10b981;
    }

    .badge-active {

      background: rgba(16,185,129,0.14);

      color: #10b981;
    }

    .badge-inactive {

      background: rgba(239,68,68,0.14);

      color: #ef4444;
    }

    /* =========================
        SALARY
    ========================== */

    .salary {

      font-weight: 800;

      color: #10b981;
    }

    /* =========================
        ACTION BUTTONS
    ========================== */

    .action-buttons {

      display: flex;

      gap: 10px;
    }

    .action-btn {

      width: 40px;

      height: 40px;

      border: none;

      border-radius: 12px;

      transition: all 0.25s ease;
    }

    .edit-btn {

      background: rgba(99,102,241,0.12);
    }

    .delete-btn {

      background: rgba(239,68,68,0.12);
    }

    .action-btn:hover {

      transform: scale(1.08);
    }

    /* =========================
        EMPTY STATE
    ========================== */

    .empty-state {

      padding: 60px 20px !important;
    }

    .empty-box {

      text-align: center;
    }

    .empty-icon {

      font-size: 3rem;

      margin-bottom: 12px;
    }

    .empty-box h4 {

      font-weight: 700;

      margin-bottom: 6px;
    }

    .empty-box p {

      color: #64748b;
    }

    /* =========================
        MODAL
    ========================== */

    .modal-overlay {

      position: fixed;

      inset: 0;

      background: rgba(15,23,42,0.6);

      backdrop-filter: blur(8px);

      display: flex;

      align-items: flex-start;

      justify-content: center;

      overflow-y: auto;

      padding: 32px 16px;

      z-index: 1000;
    }

    .modal-box {

      width: 95%;

      max-width: 760px;

      background: rgba(255,255,255,0.95);

      border-radius: 28px;

      display: flex;

      flex-direction: column;

      max-height: calc(100vh - 64px);

      overflow: hidden;

      box-shadow:
        0 30px 60px rgba(15,23,42,0.22);

      animation: popup 0.3s ease;
    }

    .modal-header-custom {

      padding: 24px 28px;

      display: flex;

      justify-content: space-between;

      align-items: center;

      border-bottom:
        1px solid rgba(148,163,184,0.14);

      flex: 0 0 auto;
    }

    .modal-header-custom h5 {

      margin: 0;

      font-size: 1.3rem;

      font-weight: 800;
    }

    .modal-header-custom p {

      margin-top: 4px;

      color: #64748b;

      font-size: 0.9rem;
    }

    .btn-close-custom {

      width: 40px;

      height: 40px;

      border-radius: 50%;

      border: none;

      background: rgba(99,102,241,0.12);

      color: #6366f1;

      transition: all 0.25s ease;
    }

    .btn-close-custom:hover {

      transform: rotate(90deg);
    }

    .modal-body-custom {

      padding: 28px;

      flex: 1 1 auto;

      min-height: 0;

      overflow-y: auto;
    }

    .modal-body-custom label {

      display: block;

      margin-bottom: 8px;

      font-size: 0.84rem;

      font-weight: 700;

      color: #64748b;
    }

    .modal-footer-custom {

      display: flex;

      justify-content: flex-end;

      gap: 14px;

      margin: 28px -28px -28px;

      padding: 18px 28px 24px;

      position: sticky;

      bottom: 0;

      background: rgba(255,255,255,0.96);

      border-top:
        1px solid rgba(148,163,184,0.14);
    }

    .cancel-btn {

      border: none;

      background: #e2e8f0;

      color: #334155;

      border-radius: 14px;

      padding: 12px 20px;

      font-weight: 700;
    }

    /* =========================
        ANIMATION
    ========================== */

    @keyframes popup {

      from {

        opacity: 0;

        transform: scale(0.92) translateY(20px);
      }

      to {

        opacity: 1;

        transform: scale(1) translateY(0);
      }
    }

    /* =========================
        RESPONSIVE
    ========================== */

    @media (max-width: 768px) {

      .modal-overlay {

        padding: 16px 10px;
      }

      .modal-box {

        max-height: calc(100vh - 32px);

        border-radius: 22px;
      }

      .modal-body-custom {

        padding: 20px;
      }

      .modal-footer-custom {

        flex-direction: column-reverse;

        margin: 24px -20px -20px;

        padding: 16px 20px 20px;

        bottom: 0;
      }

      .modal-footer-custom .btn-glow,
      .modal-footer-custom .cancel-btn {

        width: 100%;
      }

      .table-responsive {

        overflow-x: auto;
      }

      .table-custom {

        min-width: 950px;
      }

      .page-header {

        align-items: flex-start;
      }

      .glass-card {

        padding: 20px;
      }
    }

  `]
})

export class EmployeeListComponent implements OnInit {

  employees: any[] = [];

  filtered: any[] = [];

  searchTerm = '';

  showModal = false;

  isEditing = false;

  form: any = {};

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  intervalId: any;

  ngOnInit() {

    this.loadEmployees();

    // start polling for real-time-ish updates every 15s
    this.startPolling();
  }

  startPolling() {
    this.intervalId = setInterval(() => this.loadEmployees(), 15000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadEmployees() {

    this.employeeService.getAll().subscribe(data => {

      this.employees = data;

      this.filterEmployees();

      this.cdr.detectChanges();
    });
  }

  filterEmployees() {

    const term = this.searchTerm.toLowerCase();

    this.filtered = this.employees.filter(e =>

      e.name.toLowerCase().includes(term) ||

      e.email.toLowerCase().includes(term) ||

      (e.department || '').toLowerCase().includes(term)
    );
  }

  openModal() {

    this.isEditing = false;

    this.form = {
      name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      department: '',
      designation: '',
      blood_group: '',
      address: '',
      basic_salary: '',
      date_of_joining: '',
      profile_picture: ''
    };

    this.showModal = true;
  }

  editEmployee(emp: any) {

    this.isEditing = true;

    this.form = { ...emp };

    this.showModal = true;
  }

  closeModal() {

    this.showModal = false;
  }

  saveEmployee() {

    const { profile_picture, ...employeePayload } = this.form;

    if (this.isEditing) {

      this.employeeService.update(this.form._id, employeePayload).subscribe({
        next: () => {

          this.closeModal();

          this.loadEmployees();
        },
        error: error => {

          alert(error.error?.message || 'Failed to update employee.');
        }
      });

    } else {

      this.employeeService.create(employeePayload).subscribe({
        next: () => {

          this.closeModal();

          this.loadEmployees();
        },
        error: error => {

          alert(error.error?.message || 'Failed to create employee.');
        }
      });
    }
  }

  deleteEmployee(id: string) {

    if (confirm('Are you sure you want to delete this employee?')) {

      this.employeeService.delete(id).subscribe(() => {

        this.loadEmployees();
      });
    }
  }
}
