import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { AllPostsComponent } from "../../shared/components/all-posts/all-posts.component";
import { HowItWorksComponent } from "../../shared/components/how-it-work/how-it-work.component";
import { CtaSectionComponent } from '../../shared/components/cta-section/cta-section.component';
import { AuthService } from '../auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    HeroComponent,
    AllPostsComponent,
    HowItWorksComponent,
    CtaSectionComponent,
    NgIf,
  ],
  template: `
    <div class="bg-gradient-to-br from-orange-50 to-orange-100">
      <app-hero></app-hero>

      <ng-container *ngIf="isLoggedIn()">
        <app-all-posts></app-all-posts>
      </ng-container>

      <app-how-it-works></app-how-it-works>
      <app-cta-section></app-cta-section>
    </div>
  `,
})
export class HomeComponent {
  private authService = inject(AuthService);

  handleSearch({ query, category, location }: { query: string, category: string, location: string }) {
    console.log('Search Triggered:', query, category, location);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
