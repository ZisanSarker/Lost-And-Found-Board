import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DataService, Notification } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="activeTab === 'notifications'" class="p-4 bg-orange-50 rounded-lg">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Notifications</h3>
        <p class="text-sm text-gray-600">Stay updated on activity related to your items</p>
      </div>

      <div *ngIf="notifications.length === 0" class="text-gray-500 italic">
        No notifications yet
      </div>

      <div *ngFor="let notification of notifications" class="bg-white mb-3 p-4 rounded-md shadow-sm flex justify-between items-start">
        <div>
          <strong class="block text-gray-800">{{ notification.title }}</strong>
          <p class="text-sm text-gray-700">{{ notification.description }}</p>
          <small class="text-xs text-gray-500">{{ notification.time }}</small>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
          <button 
            type="button" 
            class="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
            View Item
          </button>

          <button 
            *ngIf="notification.unread" 
            type="button" 
            (click)="markAsRead(notification.id)" 
            class="text-sm px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationTabComponent implements OnInit, OnDestroy {
  @Input() activeTab!: string;
  @Input() notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadNotifications() {
    const notificationSub = this.dataService.getNotifications().subscribe({
      next: (notifications) => {
        console.log('Fetched notifications:', notifications); // Debug log
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
    this.subscription.add(notificationSub);
  }

  markAsRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.unread = false;
    }
  }
}
