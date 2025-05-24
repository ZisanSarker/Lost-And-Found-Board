import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  template: `
    <section class="w-full py-12 md:py-24 lg:py-32 pattern-bg">
      <div class="container px-4 md:px-6 mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl text-orange-600 dark:text-orange-400 gradient-heading">
            How It Works
          </h2>
          <p class="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl mt-2">
            Our platform makes it easy to report and find lost items
          </p>
        </div>
        <div class="grid gap-8 lg:grid-cols-3 items-center">
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <div class="mb-4 text-5xl text-orange-500 dark:text-orange-400">
              <!-- Map icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mx-auto w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6a2 2 0 00-2-2H5l7-4 7 4h-2a2 2 0 00-2 2v6" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Interactive Maps</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Visualize where items were last seen or found to narrow your search.
            </p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <div class="mb-4 text-5xl text-orange-500 dark:text-orange-400">
              <!-- Message icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mx-auto w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.81L3 20l1.07-3.71A7.975 7.975 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Direct Messaging</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Connect directly with the person who found or lost an item.
            </p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <div class="mb-4 text-5xl text-orange-500 dark:text-orange-400">
              <!-- Notification icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mx-auto w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-5-5.917V5a2 2 0 10-4 0v.083A6.002 6.002 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m8 0a3 3 0 11-6 0h6z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Smart Notifications</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Get alerted when potential matches to your lost or found item are posted.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HowItWorksComponent {}
