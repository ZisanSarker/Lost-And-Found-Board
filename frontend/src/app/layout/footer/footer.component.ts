import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="w-full border-t bg-orange-100 text-orange-900">
      <div class="max-w-screen-xl mx-auto px-4 py-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-md">© 2025 Lost &amp; Found Board. All rights reserved.</p>
        <nav class="flex gap-4 text-md font-medium">
          <a routerLink="/terms" class="hover:text-orange-600 transition-colors">Terms</a>
          <a routerLink="/privacy" class="hover:text-orange-600 transition-colors">Privacy</a>
          <a routerLink="/contact-us" class="hover:text-orange-600 transition-colors">Contact</a>
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
