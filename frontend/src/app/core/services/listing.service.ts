import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Listing, ListingResponse, ListingActionResponse } from '../../features/my-listings/models/listing.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private readonly ITEMS_ENDPOINT = `${this.API_BASE_URL}/api/item`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders();
    
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  getUserListings(userId: string): Observable<ListingResponse> {
    return this.http.get<ListingResponse>(
      `${this.ITEMS_ENDPOINT}/user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  deleteListing(listingId: string, userId: string): Observable<ListingActionResponse> {
    const deleteData = { userId };
    
    return this.http.request<ListingActionResponse>(
      'DELETE',
      `${this.ITEMS_ENDPOINT}/${listingId}`,
      {
        body: deleteData,
        headers: this.getHeaders()
      }
    );
  }
}