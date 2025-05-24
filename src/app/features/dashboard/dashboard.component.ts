import { NotificationSidebarComponent } from './../../shared/components/notification-sidebar/notification-sidebar.component';
import { ProfileSidebarComponent } from './../../shared/components/profile-sidebar/profile-sidebar.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'active' | 'resolved';
  type: 'lost' | 'found';
  image: string;
}

interface Message {
  id: number;
  from: string;
  initial: string;
  message: string;
  time: string;
  itemId: string;
  itemTitle: string;
  unread: boolean;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  itemId: string;
  unread: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProfileSidebarComponent, NotificationSidebarComponent],
  template: `
    <div class="container mx-auto px-4 py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your lost and found items</p>
          </div>
          <div class="flex gap-2">
            <button class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Report Lost Item
            </button>
            <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Report Found Item
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1">
          <!-- Profile Sidebar -->
          <app-profile-sidebar></app-profile-sidebar>
          <!-- Navigation -->
          <app-notification-sidebar></app-notification-sidebar>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- My Listings Tab -->
          <div *ngIf="activeTab === 'my-listings'" class="bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 class="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    My Listings
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">Manage your lost and found item listings</p>
                </div>
                <div class="flex w-full sm:w-auto">
                  <div class="relative flex-1 sm:w-64">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search listings..." 
                      [(ngModel)]="searchQuery"
                      (keyup.enter)="handleSearch()"
                      class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                    />
                  </div>
                  <button class="ml-2 p-2 border border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6">
              <!-- Filter Tabs -->
              <div class="flex bg-orange-50 dark:bg-orange-950 rounded-lg p-1 mb-6">
                <button 
                  *ngFor="let tab of filterTabs" 
                  [class]="getFilterTabClass(tab.value)"
                  (click)="setActiveFilter(tab.value)"
                  class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
                >
                  {{ tab.label }}
                </button>
              </div>

              <!-- Listings -->
              <div *ngIf="isLoading" class="space-y-4">
                <div *ngFor="let i of [1,2]" class="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                  <div class="flex space-x-4">
                    <div class="w-48 h-32 bg-gray-300 rounded-lg"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div class="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="!isLoading && getFilteredListings().length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No listings found matching your search.</p>
              </div>

              <div *ngIf="!isLoading && getFilteredListings().length > 0" class="space-y-4">
                <div *ngFor="let listing of getFilteredListings()" class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div class="flex flex-col md:flex-row">
                    <div class="w-full md:w-48 h-48 bg-gray-200 relative group">
                      <img 
                        [src]="listing.image" 
                        [alt]="listing.title"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div class="flex-1 p-6">
                      <div class="flex justify-between items-start">
                        <div>
                          <span [class]="getBadgeClass(listing.type)" class="px-2 py-1 rounded-md text-xs font-medium">
                            {{ listing.type === 'lost' ? 'Lost' : 'Found' }}
                          </span>
                          <span *ngIf="listing.status === 'resolved'" class="ml-2 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-2 py-1 rounded-md text-xs border border-green-200">
                            Resolved
                          </span>
                          <h4 class="text-lg font-medium mt-2 text-gray-800 dark:text-gray-100">{{ listing.title }}</h4>
                          <p class="text-gray-600 dark:text-gray-300 mt-1">{{ listing.description }}</p>
                        </div>
                        <div class="relative">
                          <button 
                            (click)="toggleDropdown(listing.id)"
                            class="p-2 hover:bg-orange-50 dark:hover:bg-orange-950 rounded-lg transition-colors duration-200"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
                            </svg>
                          </button>
                          <div *ngIf="activeDropdown === listing.id" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <button class="w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-950 flex items-center">
                              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              View
                            </button>
                            <button class="w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-950 flex items-center">
                              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                              Edit
                            </button>
                            <button class="w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-950 flex items-center">
                              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {{ listing.status === 'resolved' ? 'Mark as Active' : 'Mark as Resolved' }}
                            </button>
                            <hr class="border-gray-200 dark:border-gray-700">
                            <button class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 flex items-center">
                              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div class="flex items-center">
                          <svg class="w-4 h-4 mr-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {{ listing.location }}
                        </div>
                        <div class="flex items-center">
                          <svg class="w-4 h-4 mr-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"></path>
                          </svg>
                          {{ listing.date }}
                        </div>
                      </div>
                      <div class="flex gap-2 mt-4">
                        <button class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300">
                          View Details
                        </button>
                        <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300 flex items-center">
                          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages Tab -->
          <div *ngIf="activeTab === 'messages'" class="bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Messages
              </h3>
              <p class="text-gray-600 dark:text-gray-400">Communicate with other users about lost and found items</p>
            </div>
            <div class="p-6">
              <div *ngIf="messages.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No messages yet</p>
              </div>
              <div *ngIf="messages.length > 0" class="space-y-4">
                <div *ngFor="let message of messages" 
                     [class]="'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 ' + (message.unread ? 'border-l-4 border-orange-600' : '')">
                  <div class="flex gap-4">
                    <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-700 dark:text-orange-400 font-bold border-2 border-orange-200">
                      {{ message.initial }}
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <p [class]="message.unread ? 'font-medium text-orange-700 dark:text-orange-400' : 'font-medium text-gray-800 dark:text-gray-100'">
                            {{ message.from }}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">Re: {{ message.itemTitle }}</p>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ message.time }}</p>
                      </div>
                      <p class="mt-2 text-gray-600 dark:text-gray-300">{{ message.message }}</p>
                      <div class="flex gap-2 mt-4">
                        <button class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300">
                          Reply
                        </button>
                        <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300">
                          View Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div *ngIf="activeTab === 'notifications'" class="bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Notifications
              </h3>
              <p class="text-gray-600 dark:text-gray-400">Stay updated on activity related to your items</p>
            </div>
            <div class="p-6">
              <div *ngIf="notifications.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
              <div *ngIf="notifications.length > 0" class="space-y-4">
                <div *ngFor="let notification of notifications" 
                     [class]="'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 ' + (notification.unread ? 'border-l-4 border-orange-600' : '')">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 [class]="notification.unread ? 'text-orange-700 dark:text-orange-400 font-medium' : 'text-gray-800 dark:text-gray-100 font-medium'">
                        {{ notification.title }}
                      </h4>
                      <p class="mt-1 text-gray-600 dark:text-gray-300">{{ notification.description }}</p>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ notification.time }}</p>
                  </div>
                  <div class="flex gap-2 mt-4">
                    <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300">
                      View Item
                    </button>
                    <button *ngIf="notification.unread" class="text-gray-600 hover:bg-orange-50 dark:hover:bg-orange-950 hover:text-orange-700 px-4 py-2 rounded-lg transition-all duration-300">
                      Mark as Read
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  activeTab: string = 'my-listings';
  activeFilter: string = 'all';
  searchQuery: string = '';
  isLoading: boolean = false;
  activeDropdown: string | null = null;

  filterTabs = [
    { label: 'All', value: 'all' },
    { label: 'Lost', value: 'lost' },
    { label: 'Found', value: 'found' },
    { label: 'Resolved', value: 'resolved' }
  ];

  myListings: Listing[] = [
    {
      id: 'lost-3',
      title: 'Lost Keys',
      description: 'Set of keys with a red keychain and house key.',
      location: 'South Side Bus Station',
      date: 'May 13, 2025',
      status: 'resolved',
      type: 'lost',
      image: 'https://via.placeholder.com/400x200?text=Lost+Keys'
    }
  ];

  messages: Message[] = [
    {
      id: 1,
      from: 'Sarah Williams',
      initial: 'SW',
      message: 'I think I found your wallet at the coffee shop. It matches your description.',
      time: '2 hours ago',
      itemId: 'lost-1',
      itemTitle: 'Lost Wallet',
      unread: true
    },
    {
      id: 2,
      from: 'David Brown',
      initial: 'DB',
      message: 'Is the umbrella you found black with a wooden handle? I lost one like that.',
      time: 'Yesterday',
      itemId: 'found-2',
      itemTitle: 'Found Umbrella',
      unread: false
    },
    {
      id: 3,
      from: 'Emily Davis',
      initial: 'ED',
      message: 'Thank you for finding my keys! When can we meet so I can pick them up?',
      time: '3 days ago',
      itemId: 'lost-3',
      itemTitle: 'Lost Keys',
      unread: false
    }
  ];

  notifications: Notification[] = [
    {
      id: 1,
      title: 'Potential Match Found',
      description: 'Someone reported finding a wallet that matches your lost item description.',
      time: '1 hour ago',
      itemId: 'lost-1',
      unread: true
    },
    {
      id: 2,
      title: 'New Message',
      description: 'You have a new message about your found umbrella.',
      time: 'Yesterday',
      itemId: 'found-2',
      unread: true
    },
    {
      id: 3,
      title: 'Item Resolved',
      description: 'Your lost keys listing has been marked as resolved.',
      time: '3 days ago',
      itemId: 'lost-3',
      unread: false
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.activeDropdown = null;
  }

  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  handleSearch(): void {
    this.isLoading = true;
    // Simulate search delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  toggleDropdown(listingId: string): void {
    this.activeDropdown = this.activeDropdown === listingId ? null : listingId;
  }

  getFilteredListings(): Listing[] {
    let filtered = this.myListings;

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.activeFilter !== 'all') {
      if (this.activeFilter === 'resolved') {
        filtered = filtered.filter(listing => listing.status === 'resolved');
      } else {
        filtered = filtered.filter(listing => listing.type === this.activeFilter);
      }
    }

    return filtered;
  }

  getUnreadMessagesCount(): number {
    return this.messages.filter(m => m.unread).length;
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  getTabButtonClass(tab: string): string {
    const baseClass = 'w-full flex items-center justify-start px-4 py-2 rounded-lg transition-all duration-300';
    if (this.activeTab === tab) {
      return `${baseClass} bg-gradient-to-r from-orange-600 to-red-600 text-white`;
    }
    return `${baseClass} text-gray-700 dark:text-gray-300 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950`;
  }

  getFilterTabClass(filter: string): string {
    const baseClass = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200';
    if (this.activeFilter === filter) {
      return `${baseClass} bg-white dark:bg-gray-800 text-orange-700 dark:text-orange-400 shadow-sm`;
    }
    return `${baseClass} text-gray-600 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-400`;
  }

  getBadgeClass(type: string): string {
    if (type === 'lost') {
      return 'bg-gradient-to-r from-red-700 to-red-600 text-white px-2 py-1 rounded-md text-xs font-medium';
    }
    return 'bg-gradient-to-r from-green-700 to-green-600 text-white px-2 py-1 rounded-md text-xs font-medium';
  }
}