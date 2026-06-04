import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  clockIn(): Observable<any> {
    return this.http.post(`${this.apiUrl}/clock-in`, {});
  }

  clockOut(): Observable<any> {
    return this.http.post(`${this.apiUrl}/clock-out`, {});
  }

  getTodayStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/today`);
  }

  getMyAttendance(month?: number, year?: number): Observable<any[]> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<any[]>(`${this.apiUrl}/my`, { params });
  }

  getAllAttendance(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    return this.http.get<any[]>(`${this.apiUrl}/all`, { params });
  }

  manualClockIn(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/manual`, data);
  }
}
