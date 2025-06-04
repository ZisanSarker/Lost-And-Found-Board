import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserProfile, ApiResponse } from '../../features/profile/models/user-profile.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environment.apiBaseUrl;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getProfile(): Observable<UserProfile> {
    return this.http
      .get<ApiResponse>(`${this.baseUrl}/api/profile`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map(response => ({
          ...response.user,
          joinDate: new Date(response.user.joinDate)
        })),
        catchError(this.handleError)
      );
  }

  updateProfile(updateData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http
      .patch<ApiResponse>(`${this.baseUrl}/api/profile`, updateData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map(response => ({
          ...response.user,
          joinDate: new Date(response.user.joinDate)
        })),
        catchError(this.handleError)
      );
  }

  deleteAccount(): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/api/profile`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Session expired. Please login again.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }
}