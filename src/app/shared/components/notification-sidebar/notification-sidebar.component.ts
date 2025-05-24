import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <button
        [class]="getTabButtonClass('my-listings')"
        (click)="setActiveTab('my-listings')"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          ></path>
        </svg>
        My Listings
      </button>

      <button
        [class]="getTabButtonClass('messages')"
        (click)="setActiveTab('messages')"
      >
        <div class="flex items-center">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          Messages
        </div>
        <span
          *ngIf="getUnreadMessagesCount() > 0"
          class="bg-red-600 text-white text-xs px-2 py-1 rounded-full"
        >
          {{ getUnreadMessagesCount() }}
        </span>
      </button>

      <button
        [class]="getTabButtonClass('notifications')"
        (click)="setActiveTab('notifications')"
      >
        <div class="flex items-center">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-5 5v-5zM9 3a6 6 0 016 6v7l2 2H5l2-2V9a6 6 0 016-6z"
            ></path>
          </svg>
          Notifications
        </div>
        <span
          *ngIf="getUnreadNotificationsCount() > 0"
          class="bg-red-600 text-white text-xs px-2 py-1 rounded-full"
        >
          {{ getUnreadNotificationsCount() }}
        </span>
      </button>
    </div>
  `,
})
export class NotificationSidebarComponent {
  activeTab = 'my-listings';

  getTabButtonClass(tab: string): string {
    const baseClasses =
      'w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-300';
    const activeClasses = 'bg-orange-500 text-white';
    const inactiveClasses = 'text-gray-700 hover:bg-orange-100';

    return tab === this.activeTab
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getUnreadMessagesCount(): number {
    return 2; // Replace with actual dynamic data
  }

  getUnreadNotificationsCount(): number {
    return 1; // Replace with actual dynamic data
  }
}
