import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private apiUrl = `${environment.apiUrl}/announcements`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(announcement: any): Observable<any> {
    return this.http.post(this.apiUrl, announcement);
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setSaturdaySchedule(date: string, isWorking: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/saturday`, { date, is_working: isWorking });
  }

  getSaturdaySchedule(month?: number, year?: number): Observable<any[]> {
    let url = `${this.apiUrl}/saturday`;
    if (month && year) url += `?month=${month}&year=${year}`;
    return this.http.get<any[]>(url);
  }
}
