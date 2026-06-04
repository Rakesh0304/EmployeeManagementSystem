import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <div>
          <h2>Profile</h2>
          <p>Manage your account details.</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="profile-state">Loading profile...</div>

      <div *ngIf="!isLoading" class="profile-grid">
        <section class="profile-panel identity-panel">
          <div class="avatar-wrap">
            <img
              *ngIf="profilePicture; else profileInitial"
              [src]="profilePicture"
              [alt]="form.name + ' profile picture'"
            />

            <ng-template #profileInitial>
              {{ userInitial }}
            </ng-template>
          </div>

          <h3>{{ form.name || 'User' }}</h3>
          <p>{{ form.email }}</p>
          <span class="role-badge">{{ form.role | titlecase }}</span>

          <label class="photo-btn">
            Change Photo
            <input type="file" accept="image/*" (change)="onPhotoSelected($event)" />
          </label>
        </section>

        <section class="profile-panel details-panel">
          <div class="panel-title">
            <h3>Account Details</h3>
            <span *ngIf="message" [class.error-text]="isError">{{ message }}</span>
          </div>

          <form (ngSubmit)="saveProfile()">
            <div class="form-grid">
              <label>
                Name
                <input type="text" [(ngModel)]="form.name" name="name" disabled />
              </label>

              <label>
                Email
                <input type="email" [(ngModel)]="form.email" name="email" disabled />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  [(ngModel)]="form.phone"
                  name="phone"
                  placeholder="Add phone number"
                />
              </label>

              <label>
                Department
                <input type="text" [(ngModel)]="form.department" name="department" disabled />
              </label>

              <label>
                Designation
                <input type="text" [(ngModel)]="form.designation" name="designation" disabled />
              </label>

              <label>
                Joining Date
                <input type="text" [value]="joiningDate" disabled />
              </label>
            </div>

            <div class="actions">
              <button type="button" class="secondary-btn" (click)="loadProfile()" [disabled]="isSaving">
                Reset
              </button>

              <button type="submit" class="primary-btn" [disabled]="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 1180px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0 0 6px;
      color: var(--text-primary);
      font-size: 1.75rem;
      font-weight: 800;
    }

    .page-header p {
      margin: 0;
      color: var(--text-secondary);
    }

    .profile-state,
    .profile-panel {
      background: white;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 8px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
    }

    .profile-state {
      padding: 24px;
      color: var(--text-secondary);
      font-weight: 700;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 320px minmax(0, 1fr);
      gap: 22px;
      align-items: start;
    }

    .identity-panel {
      padding: 26px;
      text-align: center;
    }

    .avatar-wrap {
      width: 132px;
      height: 132px;
      margin: 0 auto 18px;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #eef2ff, #ecfeff);
      border: 1px solid rgba(99, 102, 241, 0.18);
      color: #4f46e5;
      font-size: 3rem;
      font-weight: 900;
    }

    .avatar-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .identity-panel h3 {
      margin: 0 0 6px;
      font-size: 1.25rem;
      color: var(--text-primary);
    }

    .identity-panel p {
      margin: 0 0 14px;
      color: var(--text-secondary);
      overflow-wrap: anywhere;
    }

    .role-badge {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 6px 12px;
      border-radius: 8px;
      background: #ecfeff;
      color: #0e7490;
      font-size: 0.8rem;
      font-weight: 800;
      margin-bottom: 18px;
    }

    .photo-btn {
      width: 100%;
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid rgba(99, 102, 241, 0.22);
      background: rgba(99, 102, 241, 0.08);
      color: #4f46e5;
      font-weight: 800;
      cursor: pointer;
    }

    .photo-btn input {
      display: none;
    }

    .details-panel {
      padding: 26px;
    }

    .panel-title {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-bottom: 20px;
    }

    .panel-title h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.15rem;
      font-weight: 800;
    }

    .panel-title span {
      color: #047857;
      font-size: 0.9rem;
      font-weight: 700;
      text-align: right;
    }

    .panel-title .error-text {
      color: #dc2626;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: #374151;
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      height: 48px;
      border-radius: 8px;
      border: 1px solid #dbe3ef;
      padding: 10px 13px;
      color: var(--text-primary);
      background: white;
      font: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      text-transform: none;
    }

    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
    }

    input:disabled {
      color: #64748b;
      background: #f8fafc;
      cursor: not-allowed;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .primary-btn,
    .secondary-btn {
      min-width: 128px;
      min-height: 44px;
      border-radius: 8px;
      border: 1px solid transparent;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }

    .primary-btn {
      background: var(--gradient-1);
      color: white;
      box-shadow: 0 12px 24px rgba(99, 102, 241, 0.22);
    }

    .secondary-btn {
      background: white;
      color: #4b5563;
      border-color: #dbe3ef;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 900px) {
      .profile-grid,
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  form: Partial<UserProfile> = {
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    designation: ''
  };

  profilePicture = '';
  joiningDate = '';
  isLoading = true;
  isSaving = false;
  message = '';
  isError = false;

  constructor(private authService: AuthService) {}

  get userInitial(): string {
    return this.form.name?.charAt(0).toUpperCase() || '?';
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.message = '';

    this.authService.getProfile().subscribe({
      next: profile => {
        this.form = { ...profile };
        this.profilePicture = profile.profile_picture || '';
        this.joiningDate = profile.date_of_joining
          ? new Date(profile.date_of_joining).toLocaleDateString()
          : 'Not set';
        this.isLoading = false;
      },
      error: err => {
        this.message = err.error?.message || 'Could not load profile.';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  saveProfile(): void {
    this.isSaving = true;
    this.message = '';
    this.isError = false;

    this.authService
      .updateProfile({
        phone: this.form.phone || '',
        profile_picture: this.profilePicture || ''
      })
      .subscribe({
        next: response => {
          this.form = { ...response.user };
          this.profilePicture = response.user?.profile_picture || '';
          this.message = 'Profile saved.';
          this.isSaving = false;
        },
        error: err => {
          this.message = err.error?.message || 'Could not save profile.';
          this.isError = true;
          this.isSaving = false;
        }
      });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.message = 'Select a valid image file.';
      this.isError = true;
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 360;
        const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext('2d');
        if (!context) return;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.profilePicture = canvas.toDataURL('image/jpeg', 0.84);
        this.message = 'Photo ready. Save profile to apply it.';
        this.isError = false;
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
