import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    designation: string;
    profile_picture?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  designation: string;
  basic_salary: number;
  date_of_joining: string;
  created_at: string;
  profile_picture?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);

    return this.http.post<any>(`${this.apiUrl}/login`, { email: email.trim(), password }).pipe(
      map((response: any) => {
        const token = response?.token ?? response?.accessToken ?? response?.data?.token ?? response?.data?.accessToken;
        const user = response?.user ?? response?.data?.user ?? response?.data ?? response?.userData ?? response?.data?.userData;

        if (!token || !user) {
          throw new Error('Invalid server response for login');
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return { token, user } as LoginResponse;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: Partial<Pick<UserProfile, 'phone' | 'profile_picture'>>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profile).pipe(
      tap(response => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser && response.user) {
          const updatedUser = {
            ...currentUser,
            ...response.user
          };

          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  updateProfilePicture(profile_picture: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile-picture`, { profile_picture }).pipe(
      tap(response => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            profile_picture: response.user?.profile_picture || profile_picture
          };

          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string {
    const user = this.currentUserSubject.value;
    return user ? String(user.role).toLowerCase() : '';
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }
}
