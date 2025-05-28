import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <section class="w-11/12 mx-auto py-12 md:py-20 lg:py-28 text-gray-800">
      <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-10 space-y-8 border border-orange-100 hover:border-orange-200 transform hover:-translate-y-1">
        <h1 class="text-4xl font-bold text-center text-orange-600 hover:text-orange-700 transition-colors duration-200">Terms & Conditions</h1>

        <div class="space-y-4 p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
          <h2 class="text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">1. Acceptance of Terms</h2>
          <p class="hover:text-gray-900 transition-colors duration-200">
            By accessing and using this platform, you accept and agree to be bound by the terms and provisions outlined in this agreement. If you do not agree with any part of the terms, please do not use our service.
          </p>
        </div>

        <div class="space-y-4 p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
          <h2 class="text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">2. Posting Lost or Found Items</h2>
          <p class="hover:text-gray-900 transition-colors duration-200">
            Users are responsible for providing accurate and honest details while posting lost or found items. False or misleading information may result in removal of your post or account.
          </p>
        </div>

        <div class="space-y-4 p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
          <h2 class="text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">3. Privacy & Contact Information</h2>
          <p class="hover:text-gray-900 transition-colors duration-200">
            Any contact details (e.g., phone, email) you provide in your listing will be publicly visible. We recommend sharing only the minimum information necessary to connect with others.
          </p>
        </div>

        <div class="space-y-4 p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
          <h2 class="text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">4. User Responsibility</h2>
          <p class="hover:text-gray-900 transition-colors duration-200">
            We are not liable for any loss, fraud, or miscommunication arising from item exchanges. Users must verify claims and identities before taking further actions.
          </p>
        </div>

        <div class="space-y-4 p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
          <h2 class="text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">5. Future Changes</h2>
          <p class="hover:text-gray-900 transition-colors duration-200">
            We may update these terms from time to time. Continued use of the platform following any changes means you accept the updated terms.
          </p>
        </div>

        <div class="pt-6 text-center text-sm text-gray-500 hover:text-gray-600 transition-colors duration-200">
          Last updated: May 2025
        </div>
      </div>
    </section>
  `
})
export class TermsComponent {}