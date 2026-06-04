import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout" [class.nav-collapsed]="sidebarCollapsed">
      <aside class="app-sidebar">
        <div class="app-sidebar-header">
          <div class="app-brand">
            <div class="app-brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span class="app-brand-text" *ngIf="!sidebarCollapsed">Ray Tech</span>
          </div>
          <button class="nav-toggle-btn" type="button" (click)="sidebarCollapsed = !sidebarCollapsed" aria-label="Toggle navigation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        <nav class="app-sidebar-nav" aria-label="Main navigation">
          <a
            *ngFor="let item of menuItems"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="app-nav-item"
            [class.employee-nav]="item.label === 'Employees'"
            [attr.data-label]="item.label"
            [attr.title]="sidebarCollapsed ? item.label : null"
          >
            <span class="nav-icon">{{ item.iconText }}</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">{{ item.label }}</span>
          </a>
        </nav>

        <div class="app-sidebar-footer">
          <div class="user-info" *ngIf="!sidebarCollapsed">
            <div class="user-avatar">
              <img
                *ngIf="profilePicture; else layoutUserInitial"
                [src]="profilePicture"
                [alt]="userName + ' profile picture'"
              />
              <ng-template #layoutUserInitial>{{ userInitial }}</ng-template>
            </div>
            <div class="user-details">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRole | titlecase }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span *ngIf="!sidebarCollapsed">Logout</span>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      --nav-width: 260px;
      --nav-collapsed-width: 76px;
      display: flex;
      min-height: 100vh;
      background: var(--bg);
    }

    .app-sidebar {
      width: var(--nav-width);
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(18px);
      border-right: 1px solid rgba(226, 232, 240, 0.85);
      box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
      transition: width 0.3s ease;
      overflow: hidden;
    }

    .nav-collapsed .app-sidebar {
      width: var(--nav-collapsed-width);
      overflow: visible;
    }

    .main-content {
      flex: 1;
      margin-left: var(--nav-width);
      padding: 28px;
      min-height: 100vh;
      transition: margin-left 0.3s ease;
      overflow-x: hidden;
    }

    .nav-collapsed .main-content {
      margin-left: var(--nav-collapsed-width);
    }

    .app-sidebar-header {
      min-height: 76px;
      padding: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-bottom: 1px solid rgba(226, 232, 240, 0.85);
    }

    .app-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .app-brand-icon {
      width: 36px;
      height: 36px;
      background: var(--gradient-1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .app-brand-text {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
      white-space: nowrap;
    }

    .nav-toggle-btn {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.12);
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .nav-toggle-btn:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .app-sidebar-nav {
      flex: 1;
      padding: 14px 12px;
      overflow-y: visible;
      overflow-x: hidden;
    }

    .app-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 5px;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      font-weight: 600;
      min-height: 42px;
      white-space: nowrap;
    }

    .app-nav-item:hover {
      background: #6366f1;
      color: white;
      box-shadow: 0 12px 24px rgba(99, 102, 241, 0.28);
      transform: translateX(3px);
    }

    .app-nav-item.active {
      background: var(--gradient-1);
      color: white;
      box-shadow: 0 12px 24px rgba(99, 102, 241, 0.22);
    }

    .nav-collapsed .app-sidebar-header {
      justify-content: center;
      padding-inline: 14px;
    }

    .nav-collapsed .app-brand {
      display: none;
    }

    .nav-collapsed .app-nav-item,
    .nav-collapsed .logout-btn {
      justify-content: center;
      padding-inline: 0;
    }

    .nav-collapsed .app-sidebar-nav {
      overflow: visible;
    }

    .nav-icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      font-size: 1rem;
      font-weight: 900;
      line-height: 1;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .app-nav-item:hover .nav-icon,
    .app-nav-item.active .nav-icon {
      background: rgba(255, 255, 255, 0.18);
      color: white;
    }

    .nav-collapsed .app-nav-item {
      position: relative;
    }

    .nav-collapsed .app-nav-item:hover::after {
      content: attr(data-label);
      position: absolute;
      left: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
      background: #0f172a;
      color: white;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 10px 22px rgba(15, 23, 42, 0.18);
      z-index: 200;
    }

    .app-sidebar-footer {
      padding: 14px 18px;
      border-top: 1px solid rgba(226, 232, 240, 0.85);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      background: #fffafa;
      border: 1px solid #fee2e2;
      border-radius: 8px;
      color: #dc2626;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    @media (max-width: 768px) {
      .app-layout {
        --nav-collapsed-width: 68px;
      }

      .app-sidebar,
      .nav-collapsed .app-sidebar {
        width: var(--nav-collapsed-width);
      }

      .main-content,
      .nav-collapsed .main-content {
        margin-left: var(--nav-collapsed-width);
        padding: 20px;
      }

      .app-sidebar-header {
        justify-content: center;
        padding-inline: 12px;
      }

      .app-brand,
      .nav-text,
      .user-info,
      .logout-btn span {
        display: none !important;
      }

      .app-nav-item,
      .logout-btn {
        justify-content: center;
        padding-inline: 0;
      }
    }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
  menuItems: any[] = [];
  userName = '';
  userRole = '';
  userInitial = '';
  profilePicture = '';

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name;
      this.userRole = user.role;
      this.userInitial = user.name.charAt(0).toUpperCase();
      this.profilePicture = user.profile_picture || '';
      this.buildMenu(user.role);
      this.ensureProfileMenuItem(user.role);
    }

    this.authService.currentUser$.subscribe(currentUser => {
      if (!currentUser) return;

      this.userName = currentUser.name || '';
      this.userRole = currentUser.role || '';
      this.userInitial = this.userName.charAt(0).toUpperCase();
      this.profilePicture = currentUser.profile_picture || '';
    });
  }

  buildMenu(role: string) {
    const iconDashboard = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
    const iconUsers = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
    const iconClock = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    const iconCalendar = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    const iconDollar = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
    const iconBell = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';

    const base = `/${role}`;

    if (role === 'admin') {
      this.menuItems = [
        { label: 'Dashboard', route: `${base}/dashboard`, icon: iconDashboard, iconText: '▦' },
        { label: 'Employees', route: `${base}/employees`, icon: iconUsers, iconText: '👥' },
        { label: 'Attendance', route: `${base}/attendance`, icon: iconClock, iconText: '◷' },
        { label: 'Leaves', route: `${base}/leaves`, icon: iconCalendar, iconText: '✓' },
        { label: 'Salary', route: `${base}/salary`, icon: iconDollar, iconText: '₹' },
        { label: 'Announcements', route: `${base}/announcements`, icon: iconBell, iconText: '!' },
        { label: 'Profile', route: `${base}/profile`, iconText: 'P' }
      ];
    } else if (role === 'manager') {
      this.menuItems = [
        { label: 'Dashboard', route: `${base}/dashboard`, icon: iconDashboard, iconText: '▦' },
        { label: 'Employees', route: `${base}/employees`, icon: iconUsers, iconText: '👥' },
        { label: 'Attendance', route: `${base}/attendance`, icon: iconClock, iconText: '◷' },
        { label: 'Leaves', route: `${base}/leaves`, icon: iconCalendar, iconText: '✓' },
        { label: 'Salary', route: `${base}/salary`, icon: iconDollar, iconText: '₹' }
      ];
    } else {
      this.menuItems = [
        { label: 'Dashboard', route: `${base}/dashboard`, icon: iconDashboard, iconText: '▦' },
        { label: 'Attendance', route: `${base}/attendance`, icon: iconClock, iconText: '◷' },
        { label: 'Leaves', route: `${base}/leaves`, icon: iconCalendar, iconText: '✓' },
        { label: 'Salary', route: `${base}/salary`, icon: iconDollar, iconText: '₹' }
      ];
    }
  }

  private ensureProfileMenuItem(role: string): void {
    const base = `/${role}`;

    if (!this.menuItems.some(item => item.label === 'Profile')) {
      this.menuItems.push({ label: 'Profile', route: `${base}/profile`, iconText: 'P' });
    }
  }

  logout() {
    this.authService.logout();
  }
}
