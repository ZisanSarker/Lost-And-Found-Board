// dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {
  DataService,
  Listing,
  Message,
  Notification,
} from '../../shared/services/data.service';
import { AuthService } from '../../features/auth/auth.service';

import { ProfileSidebarComponent } from '../../shared/components/profile-sidebar/profile-sidebar.component';
import { NotificationSidebarComponent } from '../../shared/components/notification-sidebar/notification-sidebar.component';
import { MyListingsComponent } from '../../shared/components/my-listings/my-listings.component';
import { DashboardHeaderComponent } from '../../shared/components/dashboard-header/dashboard-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ProfileSidebarComponent,
    NotificationSidebarComponent,
    MyListingsComponent,
    DashboardHeaderComponent,
  ],
  template: `
    <div class="bg-orange-50 min-h-screen">
      <div class="container mx-auto px-4 py-12">
        <!-- Page Header -->
        <app-dashboard-header
          (reportLostItem)="onReportLostItem()"
          (reportFoundItem)="onReportFoundItem()"
        >
        </app-dashboard-header>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <app-profile-sidebar></app-profile-sidebar>
            <app-notification-sidebar
              [activeTab]="activeTab"
              [unreadMessagesCount]="getUnreadMessagesCount()"
              [unreadNotificationsCount]="getUnreadNotificationsCount()"
              (tabChange)="setActiveTab($event)"
            >
            </app-notification-sidebar>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <div
              *ngIf="isLoading"
              class="flex justify-center items-center h-64"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"
              ></div>
            </div>

            <div
              *ngIf="errorMessage"
              class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div class="flex">
                <svg
                  class="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p class="text-red-700">{{ errorMessage }}</p>
              </div>
              <button
                (click)="loadData()"
                class="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>

            <ng-container *ngIf="!isLoading && !errorMessage">
              <!-- Only render MyListingsComponent if currentUserId is available -->
              <app-my-listings 
                *ngIf="currentUserId" 
                [userId]="currentUserId">
              </app-my-listings>
              
              <!-- Show message if no user ID available -->
              <div 
                *ngIf="!currentUserId" 
                class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
              >
                <p class="text-yellow-700">Unable to load user information. Please try logging in again.</p>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  // 🟢 Set 'my-listings' as default
  activeTab: string = 'my-listings';
  isLoading: boolean = false;
  errorMessage: string = '';
  currentUserId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  myListings: Listing[] = [];
  messages: Message[] = [];
  notifications: Notification[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeUser(): void {
    // Subscribe to user changes to handle real-time updates
    const userSubscription = this.authService.user$.subscribe({
      next: (user) => {
        if (user && user.id) {
          this.currentUserId = user.id;
        } else {
          this.currentUserId = null;
          // If no user, redirect to login
          if (!this.authService.isLoggedIn()) {
            this.authService.logout();
          }
        }
      },
      error: (error) => {
        console.error('Error getting user information:', error);
        this.currentUserId = null;
      }
    });

    this.subscriptions.add(userSubscription);

    // Also try to get user immediately (in case user$ hasn't emitted yet)
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.id) {
      this.currentUserId = currentUser.id;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const dataSubscription = this.dataService.getData().subscribe({
      next: (data) => {
        this.myListings = data.myListings || [];
        this.messages = data.messages || [];
        this.notifications = data.notifications || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.errorMessage = 'Failed to load data. Please try again.';
        this.isLoading = false;
      },
    });

    this.subscriptions.add(dataSubscription);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getUnreadMessagesCount(): number {
    return this.messages.filter((m) => m?.unread).length;
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter((n) => n?.unread).length;
  }

  getResolvedCount(): number {
    return this.myListings.filter((listing) => listing?.status === 'resolved')
      .length;
  }

  onReportLostItem(): void {
    console.log('Navigate to report lost item');
  }

  onReportFoundItem(): void {
    console.log('Navigate to report found item');
  }
}