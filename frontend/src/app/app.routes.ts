import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'employees', loadComponent: () => import('./pages/admin/employees/employee-list.component').then(m => m.EmployeeListComponent) },
      { path: 'attendance', loadComponent: () => import('./pages/admin/attendance/attendance-manage.component').then(m => m.AttendanceManageComponent) },
      { path: 'leaves', loadComponent: () => import('./pages/admin/leaves/leave-manage.component').then(m => m.LeaveManageComponent) },
      { path: 'salary', loadComponent: () => import('./pages/admin/salary/salary-manage.component').then(m => m.SalaryManageComponent) },
      { path: 'announcements', loadComponent: () => import('./pages/admin/announcements/announcements.component').then(m => m.AnnouncementsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },
  {
    path: 'manager',
    canActivate: [authGuard],
    data: { roles: ['manager'] },
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/manager/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent) },
      { path: 'employees', loadComponent: () => import('./pages/manager/employees/employee-view.component').then(m => m.EmployeeViewComponent) },
      { path: 'attendance', loadComponent: () => import('./pages/manager/attendance/attendance-view.component').then(m => m.AttendanceViewComponent) },
      { path: 'leaves', loadComponent: () => import('./pages/manager/leaves/leave-approve.component').then(m => m.LeaveApproveComponent) },
      { path: 'salary', loadComponent: () => import('./pages/manager/salary/salary-view.component').then(m => m.SalaryViewComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },
  {
    path: 'employee',
    canActivate: [authGuard],
    data: { roles: ['employee'] },
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/employee/dashboard/emp-dashboard.component').then(m => m.EmpDashboardComponent) },
      { path: 'attendance', loadComponent: () => import('./pages/employee/attendance/my-attendance.component').then(m => m.MyAttendanceComponent) },
      { path: 'leaves', loadComponent: () => import('./pages/employee/leaves/my-leaves.component').then(m => m.MyLeavesComponent) },
      { path: 'salary', loadComponent: () => import('./pages/employee/salary/my-salary.component').then(m => m.MySalaryComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
