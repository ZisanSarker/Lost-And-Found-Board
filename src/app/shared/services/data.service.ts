import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'active' | 'resolved';
  type: 'lost' | 'found';
  image?: string;
}

export interface Message {
  id: number;
  from: string;
  initial: string;
  message: string;
  time: string;
  itemId: string;
  itemTitle: string;
  unread: boolean;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  itemId: string;
  unread: boolean;
}

export interface ApiResponse {
  lostItems: any[];
  foundItems: any[];
  myListings: Listing[];
  messages: Message[];
  notifications: Notification[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'assets/db.json';
  
  constructor(private http: HttpClient) {}

  getData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  getMyListings(): Observable<Listing[]> {
    return new Observable(observer => {
      this.getData().subscribe(data => {
        observer.next(data.myListings);
        observer.complete();
      });
    });
  }

  getMessages(): Observable<Message[]> {
    return new Observable(observer => {
      this.getData().subscribe(data => {
        observer.next(data.messages);
        observer.complete();
      });
    });
  }

  getNotifications(): Observable<Notification[]> {
    return new Observable(observer => {
      this.getData().subscribe(data => {
        observer.next(data.notifications);
        observer.complete();
      });
    });
  }
}