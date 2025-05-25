// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any | null>(null);
  public user$ = this.userSubject.asObservable();

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private router: Router) {
    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }

  login(token: string, user: any): void {
    if (this.isBrowser) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
    this.router.navigate(['/home']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  getUser(): any | null {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('accessToken');
      const userJson = localStorage.getItem('user');
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          this.userSubject.next(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.logout();
        }
      } else {
        // Clear any partial data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        this.userSubject.next(null);
      }
    }
  }
}