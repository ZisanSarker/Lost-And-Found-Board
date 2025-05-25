import { Component } from '@angular/core';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  template: `
    <section
      class="w-11/12 mx-auto rounded-xl mt-24 py-16 px-4 sm:px-8 bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
      aria-labelledby="cta-heading"
    >
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div class="space-y-6">
            <h2 id="cta-heading" class="text-3xl sm:text-4xl font-bold">
              Join Our Community
            </h2>
            <p class="text-base sm:text-lg text-orange-100 leading-relaxed">
              Help reunite people with their lost belongings and make a positive impact in your community. Together,
              we can turn lost moments into found connections.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                class="px-6 py-3 text-lg font-semibold rounded-md bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Up Now
              </button>
              <button
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
  `,
})
export class CtaSectionComponent {}
