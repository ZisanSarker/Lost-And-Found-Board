import { Component } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  template: `
    <section class="w-11/12 rounded-xl mx-auto py-12 md:py-24 lg:py-38 bg-white shadow-lg">
      <div class="container px-4 md:px-6 mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl text-orange-600">
            How It Works
          </h2>
          <p class="mx-auto max-w-2xl md:text-xl mt-2 text-gray-700">
            Our platform helps you post and find lost items with ease.
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3 items-stretch">
          <!-- Card 1 -->
          <div class="flex flex-col p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200 h-full text-center">
            <div class="mb-4 text-orange-500">
              <svg class="w-12 h-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Create Lost or Found Post</h3>
            <p class="text-gray-600 mt-auto">
              Quickly create a post for your lost item or something you found with details and contact info.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="flex flex-col p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200 h-full text-center">
            <div class="mb-4 text-orange-500">
              <svg class="w-12 h-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0H4m16 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Browse Listings</h3>
            <p class="text-gray-600 mt-auto">
              Explore all lost and found items posted by users to help return or reclaim belongings.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="flex flex-col p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200 h-full text-center">
            <div class="mb-4 text-orange-500">
              <svg class="w-12 h-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 10l1.293 1.293a1 1 0 001.414 0L10 7l7 7m0 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m14 0l3-3" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Connect via Contact Info</h3>
            <p class="text-gray-600 mt-auto">
              Contact the person who lost or found the item using provided email or phone number.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HowItWorksComponent {}
