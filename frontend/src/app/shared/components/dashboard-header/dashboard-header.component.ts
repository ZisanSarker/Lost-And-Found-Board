import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse">
            Dashboard
          </h1>
          <p class="text-gray-600 mt-2">Manage your lost and found items</p>
        </div>
        <div class="flex gap-2">
          <button 
            (click)="navigateTo('lost')"
            class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Report Lost Item
          </button>
          <button 
            (click)="navigateTo('found')"
            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Report Found Item
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardHeaderComponent {
  constructor(private router: Router) {}

  navigateTo(type: 'lost' | 'found') {
    this.router.navigate([`/repost/${type}`]);
  }
}
