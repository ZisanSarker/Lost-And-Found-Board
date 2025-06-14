import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-center gap-6 text-center">
          <!-- Header Text -->
          <div class="max-w-3xl mx-auto animate-fade-in">
            <h1
              class="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent animate-pulse"
            >
              Turn Moments of Panic into Stories of Reunion
            </h1>
            <p class="mt-4 text-lg text-orange-700">
              A community-powered space where you can quickly report lost or discovered items and connect with others.
            </p>
          </div>
          
          <!-- Action Buttons (only if logged in) -->
          <div class="w-full max-w-sm mt-4 animate-slide-up" *ngIf="isLoggedIn">
            <div class="flex gap-4 justify-center">
              <a
                routerLink="/repost/lost"
                class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 font-semibold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Report Lost Item
              </a>
              <a
                routerLink="/repost/found"
                class="border-2 border-orange-600 text-orange-600 hover:text-white hover:bg-orange-600 px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Report Found Item
              </a>
            </div>
          </div>
          
          <!-- Login Prompt (only if not logged in) -->
          <div class="w-full max-w-md mt-4 animate-slide-up" *ngIf="!isLoggedIn">
            <div class="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-orange-200 shadow-lg">
              <p class="text-orange-800 mb-4 font-medium">
                Join our community to report lost or found items
              </p>
              <div class="flex gap-3 justify-center">
                <a
                  routerLink="/auth/login"
                  class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-300"
                >
                  Sign In
                </a>
                <a
                  routerLink="/auth/register"
                  class="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-md font-semibold transition-colors duration-300"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
          
          <!-- Image and Decorations -->
          <div class="relative mt-10 w-full max-w-4xl animate-fade-in animation-delay-500">
            <div class="absolute -top-10 -left-10 w-20 h-20 bg-orange-200 rounded-full opacity-70 animate-bounce"></div>
            <div class="absolute -bottom-10 -right-10 w-16 h-16 bg-orange-300 rounded-full opacity-70 animate-bounce animation-delay-1000"></div>
            <img
              src="/home_cover.png"
              alt="Community reunions"
              class="w-full rounded-lg shadow-xl transition-shadow duration-300 hover:shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  private authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn();
}