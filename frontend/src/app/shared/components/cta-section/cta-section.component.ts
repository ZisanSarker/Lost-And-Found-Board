import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="w-11/12 mx-auto rounded-xl mt-24 py-16 px-4 sm:px-8 bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
      aria-labelledby="cta-heading"
    >
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div class="space-y-6">
            <h2 id="cta-heading" class="text-3xl sm:text-4xl font-bold">
              {{ authService.isLoggedIn() ? 'Welcome to the Community!' : 'Join Our Community' }}
            </h2>
            <p class="text-base sm:text-lg text-orange-100 leading-relaxed">
              {{ authService.isLoggedIn() 
                ? 'Start posting lost or found items to help reunite people with their belongings.'
                : 'Help reunite people with their lost belongings and make a positive impact in your community. Together, we can turn lost moments into found connections.' 
              }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                *ngIf="!authService.isLoggedIn()"
                (click)="signUp()"
                class="px-6 py-3 text-lg font-semibold rounded-md bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Up Now
              </button>
              
              <div *ngIf="authService.isLoggedIn()" class="flex flex-col sm:flex-row gap-4">
                <button
                  (click)="postLostItem()"
                  class="px-6 py-3 text-lg font-semibold rounded-md bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Post Lost Item
                </button>
                <button
                  (click)="postFoundItem()"
                  class="px-6 py-3 text-lg font-semibold rounded-md border border-white text-white hover:bg-white/10 transition-all duration-300"
                >
                  Post Found Item
                </button>
              </div>
              
              <button
                (click)="showLearnMore()"
                class="px-6 py-3 text-lg font-semibold rounded-md border border-white text-white hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
          <div class="relative">
            <img
              src="/assets/cta_cover.jpg"
              alt="Illustration showing community members helping each other find lost items"
              class="w-full h-auto rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Learn More Modal -->
    <div 
      *ngIf="showModal()"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="closeModal()"
    >
      <div 
        class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-2xl font-bold text-gray-800">About Lost & Found Board</h3>
            <button 
              (click)="closeModal()"
              class="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6 text-gray-700">
          <div>
            <h4 class="text-lg font-semibold text-orange-600 mb-2">What is Lost & Found Board?</h4>
            <p class="leading-relaxed">
              Lost & Found Board is a community-driven platform that connects people who have lost items 
              with those who have found them. Our mission is to reunite belongings with their rightful 
              owners through the power of community cooperation.
            </p>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-orange-600 mb-2">How It Works</h4>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
                <p><strong>Post:</strong> Create a listing for items you've lost or found with detailed descriptions and photos.</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
                <p><strong>Search:</strong> Browse through listings to find your lost items or help others find theirs.</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
                <p><strong>Connect:</strong> Contact the person who found your item or vice versa to arrange a safe return.</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
                <p><strong>Reunite:</strong> Celebrate as belongings are returned to their rightful owners!</p>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-orange-600 mb-2">Key Features</h4>
            <ul class="space-y-2">
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                Easy-to-use posting system for lost and found items
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                Photo uploads to help identify items
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                Location-based search to find items near you
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                Secure messaging system for safe communication
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✓</span>
                Community-driven approach with verified users
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-orange-600 mb-2">Why Join Our Community?</h4>
            <p class="leading-relaxed">
              By joining Lost & Found Board, you become part of a caring community dedicated to helping 
              others. Whether you've lost something precious or found an item that belongs to someone else, 
              our platform makes it easy to do the right thing and make someone's day brighter.
            </p>
          </div>

          <div class="bg-orange-50 p-4 rounded-lg">
            <p class="text-orange-800 font-medium text-center">
              Ready to make a difference? Sign up today and help build a more connected community!
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CtaSectionComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  showModal = signal(false);

  signUp() {
    // Navigate to sign up page
    this.router.navigate(['/auth/sign-up']);
  }

  postLostItem() {
    // Navigate to post lost item form
    this.router.navigate(['/repost/lost']);
  }

  postFoundItem() {
    // Navigate to post found item form
    this.router.navigate(['/repost/found']);
  }

  showLearnMore() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}