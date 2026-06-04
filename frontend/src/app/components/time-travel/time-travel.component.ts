import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-time-travel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="time-travel-panel" [class.is-simulated]="isSimulated$ | async">
      <div class="panel-header">
        <div class="title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          System Time Travel
        </div>
        <span class="status-badge" *ngIf="isSimulated$ | async">Testing Mode</span>
      </div>

      <div class="current-display">
        <span class="label">Perceived Time:</span>
        <span class="value">{{ (currentTime$ | async) | date:'MMM d, h:mm:ss a' }}</span>
      </div>

      <div class="controls">
        <div class="quick-jumps">
          <button (click)="fastForward(1)" title="+1 Hour">+1h</button>
          <button (click)="fastForward(8)" title="+8 Hours">+8h</button>
          <button (click)="fastForward(24)" title="+24 Hours">+24h</button>
        </div>
        
        <div class="custom-jump">
          <input type="datetime-local" [(ngModel)]="selectedTime" class="time-input">
          <button (click)="setTime()" class="set-btn">Jump</button>
        </div>

        <button (click)="reset()" class="reset-btn" *ngIf="isSimulated$ | async">
          Sync with Real Time
        </button>
      </div>
    </div>
  `,
  styles: [`
    .time-travel-panel {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      margin-top: 12px;
      transition: all 0.3s ease;
    }

    .time-travel-panel.is-simulated {
      background: #fffbeb;
      border-color: #fef3c7;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .title {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-badge {
      font-size: 0.65rem;
      font-weight: 700;
      background: #f59e0b;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .current-display {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
    }

    .current-display .label {
      font-size: 0.7rem;
      color: var(--text-secondary);
    }

    .current-display .value {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--primary);
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quick-jumps {
      display: flex;
      gap: 4px;
    }

    .quick-jumps button {
      flex: 1;
      padding: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .quick-jumps button:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--primary-light);
    }

    .custom-jump {
      display: flex;
      gap: 4px;
    }

    .time-input {
      flex: 1;
      font-size: 0.75rem;
      padding: 6px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      outline: none;
    }

    .set-btn {
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .reset-btn {
      padding: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      background: white;
      color: #dc2626;
      border: 1px solid #fee2e2;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .reset-btn:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }
  `]
})
export class TimeTravelComponent implements OnInit {
  currentTime$: Observable<Date>;
  isSimulated$: Observable<boolean>;
  selectedTime: string = '';

  constructor(private timeService: TimeService) {
    this.currentTime$ = this.timeService.getAppTime();
    this.isSimulated$ = this.timeService.getIsSimulated();
  }

  ngOnInit() {
    this.updateSelectedTime(this.timeService.getCurrentTime());
  }

  private updateSelectedTime(date: Date) {
    // Format to yyyy-MM-ddThh:mm for datetime-local
    const tzOffset = date.getTimezoneOffset() * 60000;
    this.selectedTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  }

  fastForward(hours: number) {
    this.timeService.fastForward(hours);
    this.updateSelectedTime(this.timeService.getCurrentTime());
  }

  setTime() {
    if (this.selectedTime) {
      this.timeService.setSimulatedTime(new Date(this.selectedTime));
    }
  }

  reset() {
    this.timeService.resetToRealTime();
    this.updateSelectedTime(new Date());
  }
}
