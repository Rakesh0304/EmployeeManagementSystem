import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TimeService {
  private offset = 0; // ms offset from real time
  private isSimulated = new BehaviorSubject<boolean>(false);
  
  // Use a BehaviorSubject for the current time to allow subscription
  private currentTime$ = new BehaviorSubject<Date>(new Date());

  constructor() {
    // Load persisted offset and simulated state
    const savedOffset = localStorage.getItem('timeOffset');
    const savedIsSimulated = localStorage.getItem('isSimulated');
    
    if (savedOffset) this.offset = parseInt(savedOffset, 10);
    if (savedIsSimulated === 'true') this.isSimulated.next(true);

    // Update the current time every second
    timer(0, 1000).subscribe(() => {
      this.currentTime$.next(this.getCurrentTime());
    });
  }

  getCurrentTime(): Date {
    return new Date(Date.now() + this.offset);
  }

  getAppTime(): Observable<Date> {
    return this.currentTime$.asObservable();
  }

  getIsSimulated(): Observable<boolean> {
    return this.isSimulated.asObservable();
  }

  setSimulatedTime(date: Date) {
    this.offset = date.getTime() - Date.now();
    this.isSimulated.next(true);
    this.persist();
    this.currentTime$.next(this.getCurrentTime());
  }

  fastForward(hours: number) {
    this.offset += hours * 60 * 60 * 1000;
    this.isSimulated.next(true);
    this.persist();
    this.currentTime$.next(this.getCurrentTime());
  }

  resetToRealTime() {
    this.offset = 0;
    this.isSimulated.next(false);
    localStorage.removeItem('timeOffset');
    localStorage.removeItem('isSimulated');
    this.currentTime$.next(new Date());
  }

  private persist() {
    localStorage.setItem('timeOffset', this.offset.toString());
    localStorage.setItem('isSimulated', 'true');
  }
}
