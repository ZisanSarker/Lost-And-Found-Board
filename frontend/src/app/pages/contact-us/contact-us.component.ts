import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-orange-50 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-orange-800 mb-4">Contact Us</h1>
          <p class="text-lg text-orange-600">
            We're here to help! Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Contact Form -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-orange-800 mb-6">Send Message</h2>
            
            <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-orange-700 mb-2">Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  class="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Your full name">
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-orange-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  [(ngModel)]="formData.email"
                  name="email"
                  required
                  class="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="your.email@example.com">
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-orange-700 mb-2">Subject *</label>
                <select 
                  [(ngModel)]="formData.subject"
                  name="subject"
                  required
                  class="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Select a subject</option>
                  <option value="lost-item">Lost Item</option>
                  <option value="found-item">Found Item</option>
                  <option value="general">General Question</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium text-orange-700 mb-2">Message *</label>
                <textarea 
                  [(ngModel)]="formData.message"
                  name="message"
                  required
                  rows="5"
                  class="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell us how we can help you..."></textarea>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit"
                [disabled]="!contactForm.form.valid || isSubmitting"
                class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>

            <!-- Success Message -->
            <div *ngIf="showSuccess" class="mt-4 p-4 bg-green-100 border border-green-300 rounded-md">
              <p class="text-green-700">✓ Message sent successfully! We'll get back to you soon.</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-orange-800 mb-4">Get In Touch</h3>
              
              <div class="space-y-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26c.67.36 1.45.36 2.12 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-orange-800">Email</p>
                    <p class="text-orange-600">{{'support@lostandfound.com'}}</p>
                  </div>
                </div>

                <div class="flex items-center">
                  <svg class="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-orange-800">Phone</p>
                    <p class="text-orange-600">+880 1622000196</p>
                  </div>
                </div>

                <div class="flex items-center">
                  <svg class="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-orange-800">Response Time</p>
                    <p class="text-orange-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-orange-800 mb-4">Quick Help</h3>
              <div class="space-y-2 text-sm">
                <p class="text-orange-700">• <strong>Lost something?</strong> Report it as soon as possible</p>
                <p class="text-orange-700">• <strong>Found something?</strong> Help us return it to the owner</p>
                <p class="text-orange-700">• <strong>Need support?</strong> We're here to help you navigate the process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactUsComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showSuccess = false;

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccess = true;
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      
      setTimeout(() => {
        this.showSuccess = false;
      }, 5000);
    }, 1500);
  }
}