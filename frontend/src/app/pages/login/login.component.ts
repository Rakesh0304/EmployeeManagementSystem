import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `

    <div class="auth-page">

      <!-- Background -->
      <div class="bg-grid"></div>

      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <!-- Login Card -->
      <div class="login-card">

        <!-- Header -->
        <div class="login-header">

          <!-- Logo -->
          <div class="logo-box">

            <div class="rt-logo">

              <span class="logo-r">
                R
              </span>

              <span class="logo-t">
                T
              </span>

            </div>

          </div>

          <!-- Company Name -->
          <div class="brand-container">

            <h1 class="company-name">

              <span class="ray">
                RAY
              </span>

              <span class="technologies">
                TECHNOLOGIES
              </span>

            </h1>

            <div class="brand-line"></div>

          </div>

    

        </div>

          <p class="subtitle">
            Sign in to your employee management dashboard with your assigned credentials.
          </p>

        <div
          *ngIf="errorMessage"
          class="error-box"
        >

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>

          {{ errorMessage }}

        </div>

        <!-- Role Login -->
        <div class="role-tabs">

          <button
            *ngFor="let login of quickLogins"
            type="button"
            class="role-tab"
            [class.active]="selectedRole === login.label"
            [disabled]="isLoading"
            (click)="selectRole(login.label)"
          >
            <span class="role-name">{{ login.label }}</span>
          </button>

        </div>

        <!-- Form -->
        <form
          class="login-form"
          (ngSubmit)="onLogin()"
          autocomplete="off"
        >

          <!-- Email -->
          <div class="field">

            <label>
              Email Address
            </label>

            <div class="input-group">

              <span class="input-icon">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>

              </span>

              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                autocomplete="email"
                placeholder="name@company.com"
                required
              />

            </div>

          </div>

          <!-- Password -->
          <div class="field">

            <label>
              Password
            </label>

            <div class="input-group">

              <span class="input-icon">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                  ></rect>

                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>

                </svg>

              </span>

              <input
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                autocomplete="current-password"
                placeholder="Enter your password"
                required
              />

              <!-- Toggle Password -->
              <button
                type="button"
                class="toggle-password"
                (click)="togglePassword()"
              >

                <!-- Eye -->
                <svg
                  *ngIf="!showPassword"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>

                <!-- Eye Off -->
                <svg
                  *ngIf="showPassword"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.77 21.77 0 0 1 5.06-6.94"></path>
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.91 21.91 0 0 1-2.17 3.19"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>

              </button>

            </div>

          </div>

          <!-- Options -->
          <div class="options-row">

            <label class="remember-box">

              <input type="checkbox" />

              <span>
                Remember me
              </span>

            </label>

            <a href="#">
              Forgot password?
            </a>

          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="login-btn"
            [disabled]="isLoading"
          >

            <span *ngIf="!isLoading">
              Sign In
            </span>

            <div
              *ngIf="isLoading"
              class="loader"
            ></div>

          </button>

          

        </form>

      </div>

      <!-- Footer -->
      <div class="footer">
        © 2026 RAY TECHNOLOGIES. All rights reserved.
      </div>

    </div>

  `,

  styles: [`

    * {
      box-sizing: border-box;
    }

    .auth-page {
      min-height: 100vh;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      position: relative;

      overflow: hidden;

      padding: 20px;

      background:
        linear-gradient(
          135deg,
          #eef2ff 0%,
          #f8fafc 50%,
          #ffffff 100%
        );

      font-family: "Inter", sans-serif;
    }

    .bg-grid {
      position: absolute;
      inset: 0;

      background-image:
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);

      background-size: 40px 40px;
    }

    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.18;
    }

    .blob-1 {
      width: 420px;
      height: 420px;
      background: #6366f1;

      top: -120px;
      right: -120px;
    }

    .blob-2 {
      width: 360px;
      height: 360px;
      background: #8b5cf6;

      bottom: -120px;
      left: -120px;
    }

    .login-card {
      width: 100%;
      max-width: 470px;

      padding: 34px;

      border-radius: 32px;

      background: rgba(255,255,255,0.78);

      backdrop-filter: blur(18px);

      border: 1px solid rgba(255,255,255,0.5);

      box-shadow:
        0 20px 50px rgba(0,0,0,0.08);

      position: relative;
      z-index: 5;
    }

    .login-header {
      text-align: center;
      margin-bottom: 26px;
    }

    .logo-box {
      width: 90px;
      height: 90px;

      margin: 0 auto 20px;

      border-radius: 28px;

      background:
        linear-gradient(
          135deg,
          #4f46e5,
          #7c3aed
        );

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow:
        0 12px 28px rgba(99,102,241,0.22);

      position: relative;
    }

    .rt-logo {
      display: flex;
      align-items: center;

      font-size: 2.6rem;
      font-weight: 900;

      letter-spacing: -5px;
    }

    .logo-r {
      color: white;
    }

    .logo-t {
      color: #c4b5fd;
    }

    .brand-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .company-name {
      margin: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      gap: 8px;

      font-size: 2.4rem;
      font-weight: 900;

      letter-spacing: -2px;

      line-height: 1;
    }

    .ray,
    .technologies {

      background:
        linear-gradient(
          135deg,
          #6366f1,
          #8b5cf6,
          #06b6d4
        );

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      background-clip: text;
    }

    .brand-line {
      width: 120px;
      height: 5px;

      margin-top: 18px;

      border-radius: 999px;

      background:
        linear-gradient(
          90deg,
          #6366f1,
          #8b5cf6,
          #06b6d4
        );
    }

    .subtitle {
      margin-top: 18px;

      color: #6b7280;

      font-size: 0.96rem;
      font-weight: 500;

      line-height: 1.5;

      max-width: 320px;

      margin-left: auto;
      margin-right: auto;
    }

    .role-tabs {
      display: flex;
      gap: 10px;

      margin-bottom: 22px;
    }

    .role-tab {
      flex: 1;

      min-height: 58px;

      padding: 12px;

      border-radius: 14px;

      border: 2px solid #e5e7eb;

      background: white;

      font-size: 0.9rem;
      font-weight: 700;

      color: #6b7280;

      cursor: pointer;

      transition: all 0.25s ease;

      display: flex;
      justify-content: center;
      text-align: center;
    }

    .role-tab:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .role-tab:hover {
      border-color: #6366f1;
      color: #6366f1;

      transform: translateY(-2px);
    }

    .role-name {
      color: #111827;
      font-size: 0.9rem;
      font-weight: 900;
    }

    .role-tab.active {
      background:
        linear-gradient(
          135deg,
          #6366f1,
          #8b5cf6
        );

      color: white;

      border-color: transparent;

      box-shadow:
        0 10px 24px rgba(99,102,241,0.28);
    }

    .role-tab.active .role-name {
      color: white;
    }

    .error-box {
      display: flex;
      align-items: center;
      gap: 10px;

      padding: 14px 16px;

      border-radius: 14px;

      background: #fef2f2;

      border: 1px solid #fecaca;

      color: #dc2626;

      margin-bottom: 18px;

      font-size: 0.92rem;
      font-weight: 600;
    }

    .field {
      margin-bottom: 18px;
    }

    .field label {
      display: block;

      margin-bottom: 10px;

      font-size: 0.8rem;
      font-weight: 800;

      color: #374151;

      text-transform: uppercase;

      letter-spacing: 1px;
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 18px;

      display: flex;
      align-items: center;

      color: #9ca3af;
    }

    .input-group input {
      width: 100%;
      height: 58px;

      padding: 16px 56px 16px 54px;

      border-radius: 18px;

      border: 2px solid #e5e7eb;

      background: rgba(255,255,255,0.92);

      font-size: 1rem;
      font-weight: 500;

      color: #111827;

      transition: all 0.25s ease;
    }

    .input-group input::placeholder {
      color: #9ca3af;
    }

    .input-group input:focus {
      outline: none;

      border-color: #6366f1;

      background: white;

      box-shadow:
        0 0 0 5px rgba(99,102,241,0.12);

      transform: translateY(-1px);
    }

    .toggle-password {
      position: absolute;
      right: 12px;

      width: 38px;
      height: 38px;

      border: none;
      border-radius: 12px;

      background: transparent;

      display: flex;
      align-items: center;
      justify-content: center;

      color: #6b7280;

      cursor: pointer;

      transition: all 0.2s ease;
    }

    .toggle-password:hover {
      background: #f3f4f6;
      color: #6366f1;
    }

    .options-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-bottom: 22px;
    }

    

    .remember-box {
      display: flex;
      align-items: center;
      gap: 8px;

      font-size: 0.9rem;

      color: #4b5563;
    }

    .options-row a {
      text-decoration: none;

      color: #6366f1;

      font-size: 0.9rem;
      font-weight: 700;
    }

    .login-btn {
      width: 100%;
      height: 58px;

      border: none;
      border-radius: 18px;

      background:
        linear-gradient(
          135deg,
          #6366f1,
          #8b5cf6
        );

      color: white;

      font-size: 1rem;
      font-weight: 800;

      cursor: pointer;

      transition: all 0.3s ease;

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow:
        0 15px 30px rgba(99,102,241,0.28);
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-3px);

      box-shadow:
        0 22px 40px rgba(99,102,241,0.35);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loader {
      width: 22px;
      height: 22px;

      border-radius: 50%;

      border: 3px solid rgba(255,255,255,0.35);
      border-top-color: white;

      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {

      to {
        transform: rotate(360deg);
      }

    }

    .footer {
      margin-top: 20px;

      color: #6b7280;

      font-size: 0.85rem;

      z-index: 5;
    }

    @media (max-width: 520px) {

      .login-card {
        padding: 28px 22px;
      }

      .company-name {
        font-size: 2rem;
      }

      .role-tabs {
        flex-direction: column;
      }

      .options-row {
        flex-direction: column;
        gap: 14px;
        align-items: flex-start;
      }

    }

  `]

})

export class LoginComponent {

  email = '';

  password = '';

  errorMessage = '';

  isLoading = false;

  showPassword = false;

  selectedRole = '';

  quickLogins = [
    {
      label: 'Admin',
      email: 'admin@company.com',
      password: 'password123'
    },
    {
      label: 'Manager',
      email: 'manager@company.com',
      password: 'password123'
    },
    {
      label: 'Employee',
      email: 'mukesh@gmail.com',
      password: 'password123'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    if (this.authService.isLoggedIn()) {

      this.redirectByRole(
        this.authService.getRole()
      );

    }

  }

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

  loginAs(login: { email: string; password: string }): void {
    this.email = login.email;
    this.password = login.password;
    this.errorMessage = '';
  }

  selectRole(label: string): void {
    const selectedLogin = this.quickLogins.find(login => login.label.toLowerCase() === label.toLowerCase());
    this.selectedRole = label;
    this.errorMessage = '';

    if (selectedLogin) {
      this.loginAs(selectedLogin);
    }
  }

  onLogin(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.authService.login(
      this.email,
      this.password
    ).subscribe({

      next: (response: any) => {

        this.isLoading = false;

        // Prefer the role stored in AuthService (from localStorage/currentUserSubject).
        let actualRole = String(this.authService.getRole() || response?.user?.role || response?.role || '').toLowerCase();

        if (!actualRole) {
          this.errorMessage = 'Login succeeded but user role could not be determined.';
          return;
        }

        // Clear any selected role after successful authentication and redirect by actual role
        this.selectedRole = '';
        this.redirectByRole(actualRole);

      },

      error: (err: any) => {

        this.isLoading = false;

        if (err.status === 0) {
          this.errorMessage =
            'Cannot connect to the API server. Check the backend and HTTPS configuration.';
          return;
        }

        this.errorMessage =
          err.error?.message ||
          err.message ||
          'Login failed. Please try again.';

      }

    });

  }

  private redirectByRole(role: string): void {
    const normalizedRole = String(role).toLowerCase();

    switch (normalizedRole) {

      case 'admin':
        this.router.navigate(['/admin']);
        break;

      case 'manager':
        this.router.navigate(['/manager']);
        break;

      case 'employee':
        this.router.navigate(['/employee']);
        break;

      default:
        this.router.navigate(['/login']);

    }

  }

}
