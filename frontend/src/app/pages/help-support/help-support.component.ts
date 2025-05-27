import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <!-- Header Section -->
      <div class="bg-orange-600 text-white py-12">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Help & Support</h1>
            <p class="text-xl text-orange-100">We're here to help you with Lost & Found</p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <!-- Contact Information -->
        <div class="mb-12">
          <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-500">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Contact Information
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex items-center p-4 bg-orange-50 rounded-lg">
                <svg class="w-8 h-8 text-orange-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold text-gray-800">Email Support</h3>
                  <a href="mailto:sakibuzzamanjisan@gmail.com" class="text-orange-600 hover:text-orange-700 transition-colors">
                    {{"sakibuzzamanjisan@gmail.com"}}
                  </a>
                </div>
              </div>
              <div class="flex items-center p-4 bg-orange-50 rounded-lg">
                <svg class="w-8 h-8 text-orange-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold text-gray-800">Phone Support</h3>
                  <a href="tel:01622000196" class="text-orange-600 hover:text-orange-700 transition-colors">
                    01622000196
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <div *ngFor="let faq of faqs; let i = index" class="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                (click)="toggleFaq(i)"
                class="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 hover:bg-orange-50 transition-colors">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-800">{{ faq.question }}</h3>
                  <svg 
                    class="w-5 h-5 text-orange-600 transition-transform duration-200"
                    [class.rotate-180]="faq.isOpen"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>
              <div *ngIf="faq.isOpen" class="px-6 pb-4 text-gray-600 border-t border-orange-100">
                <p class="pt-4">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Categories -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">How Can We Help You?</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div *ngFor="let category of supportCategories" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-orange-500">
              <div class="text-center">
                <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="category.icon"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ category.title }}</h3>
                <p class="text-gray-600">{{ category.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Hours -->
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Support Hours</h2>
          <div class="text-gray-600">
            <p class="mb-2"><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
            <p class="mb-2"><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
            <p class="mb-4"><strong>Sunday:</strong> Closed</p>
            <div class="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
              <strong>Average Response Time: 2-4 hours</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-orange-600 text-white py-8 mt-12">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Lost & Found</h3>
          <p class="text-orange-100">Helping you reunite with what matters most</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class HelpSupportComponent {
  faqs = [
    {
      question: 'How do I report a lost item?',
      answer: 'You can report a lost item by creating an account and clicking on "Report Lost Item" from your dashboard. Fill in all the details about your lost item including description, location, and date.',
      isOpen: false
    },
    {
      question: 'How do I report a found item?',
      answer: 'To report a found item, go to "Report Found Item" section, upload clear photos of the item, and provide details about where and when you found it. This helps owners identify their belongings.',
      isOpen: false
    },
    {
      question: 'Is there a fee for using Lost & Found?',
      answer: 'Our basic services are completely free. We believe in helping people reunite with their belongings without any cost barriers.',
      isOpen: false
    },
    {
      question: 'How will I be notified if my item is found?',
      answer: 'You will receive notifications via email and SMS when someone reports finding an item that matches your description. Make sure to keep your contact information updated.',
      isOpen: false
    },
    {
      question: 'What should I do if I find my lost item?',
      answer: 'Please update your lost item report to "Found" status as soon as possible. This helps keep our database accurate and prevents unnecessary notifications.',
      isOpen: false
    },
    {
      question: 'How long do items stay in the system?',
      answer: 'Lost item reports remain active for 90 days. Found item reports stay active for 30 days. You can extend these periods by contacting our support team.',
      isOpen: false
    }
  ];

  supportCategories = [
    {
      title: 'Account Issues',
      description: 'Problems with login, registration, or account settings',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      title: 'Item Reports',
      description: 'Help with reporting lost or found items',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      title: 'Technical Support',
      description: 'Website issues, bugs, or feature requests',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}