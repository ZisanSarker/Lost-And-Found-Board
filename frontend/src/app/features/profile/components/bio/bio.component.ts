import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        About Me
      </h3>

      <div class="relative">
        <p *ngIf="!isEditing" class="text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
          {{ profile.bio || 'No bio available yet. Click edit to add one!' }}
        </p>
        <textarea *ngIf="isEditing"
                  [(ngModel)]="editForm.bio"
                  class="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Tell us about yourself..."
                  rows="6"></textarea>
      </div>
    </div>
  `
})
export class BioComponent {
  @Input() profile!: UserProfile;
  @Input() isEditing = false;
  @Input() editForm: Partial<UserProfile> = {};
}