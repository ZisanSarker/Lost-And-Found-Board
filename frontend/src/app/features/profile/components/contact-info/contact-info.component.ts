import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        Contact Information
      </h3>

      <div class="space-y-4">
        <!-- Email -->
        <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-orange-50 hover:to-red-50 transition-all duration-300">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <span *ngIf="!isEditing" class="text-gray-700 font-medium">{{ profile.email }}</span>
            <input *ngIf="isEditing"
                   [(ngModel)]="editForm.email"
                   type="email"
                   disabled
                   class="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:border-orange-500 focus:outline-none transition-colors duration-300"
                   placeholder="Enter email" />
          </div>
        </div>

        <!-- Phone -->
        <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-orange-50 hover:to-red-50 transition-all duration-300">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <span *ngIf="!isEditing" class="text-gray-700 font-medium">{{ profile.phone || 'Phone not set' }}</span>
            <input *ngIf="isEditing"
                   [(ngModel)]="editForm.phone"
                   type="tel"
                   class="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:border-orange-500 focus:outline-none transition-colors duration-300"
                   placeholder="Enter phone" />
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactInfoComponent {
  @Input() profile!: UserProfile;
  @Input() isEditing = false;
  @Input() editForm: Partial<UserProfile> = {};
}