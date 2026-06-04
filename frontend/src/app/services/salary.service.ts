import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private apiUrl = `${environment.apiUrl}/salary`;

  constructor(private http: HttpClient) {}

  calculateSalary(month: string, userId?: string): Observable<any> {
    const body: any = { month };
    if (userId) body.user_id = userId;
    return this.http.post(`${this.apiUrl}/calculate`, body);
  }

  getSalary(month?: string, userId?: string): Observable<any[]> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    if (userId) params = params.set('user_id', userId);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getMySalary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }

  downloadPayslip(salaryId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/payslip/${salaryId}`, {
      responseType: 'blob'
    });
  }
}
