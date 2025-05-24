import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gradient-to-br from-orange-300 to-orange-100 rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-2xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
        Profile
      </h3>
      <div class="flex flex-col items-center text-center">
        <div class="w-40 h-40 bg-orange-900 rounded-full flex items-center justify-center text-orange-400 text-xl font-bold mb-4 border-4 border-orange-200">
          JD
        </div>
        <h4 class="font-medium text-xl text-gray-800">Zisan Sarker</h4>
        <p class="text-md text-gray-700">{{ 'sakibuzzamanjisan@gmail.com' }}</p>
        <div class="flex gap-2 mt-4">
          <span class="bg-orange-500 text-white px-3 py-2 rounded-md text-sm border border-orange-200">
            3 Listings
          </span>
          <span class="bg-green-700 text-white px-3 py-2 rounded-md text-sm border border-green-200">
            1 Resolved
          </span>
        </div>
        <button class="mt-4 w-full border-2 border-orange-500 text-gray-700 px-4 py-2 rounded-lg border-b-1 hover:border-orange-900 hover:text-white hover:bg-orange-600 transition-all duration-300 flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317C10.325 2.28 8.584.535 6.544.535S2.766 2.28 2.766 4.317c0 2.036 1.741 3.781 3.778 3.781s3.781-1.745 3.781-3.781zm8.889 0c0-2.037-1.741-3.782-3.778-3.782s-3.778 1.745-3.778 3.782c0 2.036 1.741 3.781 3.778 3.781s3.778-1.745 3.778-3.781z" />
          </svg>
          Edit Profile
        </button>
      </div>
    </div>
  `,
})
export class ProfileSidebarComponent {}
