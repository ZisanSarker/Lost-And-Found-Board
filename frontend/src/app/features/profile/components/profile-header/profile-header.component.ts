import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../models/user-profile.model';
import { formatDate } from '../../utils/date-formatter.util';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 shadow-2xl shadow-orange-500/25 transition-all duration-500"
         [class.transform]="isEditing"
         [class.scale-[1.02]]="isEditing">
      <!-- Avatar and User Info Content -->
      <div class="relative p-8 md:p-12">
        <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <!-- Avatar Section -->
          <div class="relative group">
            <!-- Avatar display and upload UI -->
            <ng-content select="[avatarSection]"></ng-content>
          </div>

          <!-- User Info -->
          <div class="flex-1 text-center lg:text-left text-white">
            <div class="mb-4">
              <h1 *ngIf="!isEditing" class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                {{ profile.username }}
              </h1>
              <input *ngIf="isEditing"
                     [(ngModel)]="editForm.username"
                     class="text-4xl md:text-5xl font-bold bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl px-6 py-3 text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300 w-full max-w-lg"
                     placeholder="Enter your username" />
            </div>

            <!-- Meta Info -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-8 text-white/90">
              <!-- Join Date -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V11a4 4 0 118 0v4"></path>
                </svg>
                <span class="font-medium">Joined {{ formatDate(profile.joinDate) }}</span>
              </div>

              <!-- Location -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span *ngIf="!isEditing" class="font-medium">{{ profile.location || 'Location not set' }}</span>
                <input *ngIf="isEditing"
                       [(ngModel)]="editForm.location"
                       class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300"
                       placeholder="Enter location" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <ng-content select="[actionButtons]"></ng-content>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileHeaderComponent {
  @Input() profile!: UserProfile;
  @Input() isEditing = false;
  @Input() editForm: Partial<UserProfile> = {};
  
  protected formatDate = formatDate;
}