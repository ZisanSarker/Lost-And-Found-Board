import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ItemFormData, ApiResponse } from '../../shared/models/item.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly ITEMS_ENDPOINT = `${environment.apiBaseUrl}/api/item`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  submitItem(data: ItemFormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.ITEMS_ENDPOINT,
      data,
      { headers: this.getAuthHeaders() }
    );
  }
}