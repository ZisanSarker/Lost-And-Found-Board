import { Component, Input, Output, EventEmitter } from '@angular/core';
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
    </div>
  `,
})
export class NotificationSidebarComponent {
  @Input() activeTab: string = 'my-listings';
  @Input() unreadMessagesCount: number = 0;
  @Input() unreadNotificationsCount: number = 0;
  @Output() tabChange = new EventEmitter<string>();

  getTabButtonClass(tab: string): string {
    const baseClasses =
      'w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-300';
    const activeClasses = 'bg-gradient-to-r from-orange-600 to-red-600 text-white';
    const inactiveClasses = 'text-gray-700 dark:text-gray-300 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950';
    
    return tab === this.activeTab
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  }

  setActiveTab(tab: string) {
    this.tabChange.emit(tab);
  }
}