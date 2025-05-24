import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { AllPostsComponent } from "../../shared/components/all-posts/all-posts.component";
import { HowItWorksComponent } from "../../shared/components/how-it-work/how-it-work.component";

@Component({
  selector: 'app-home',
  imports: [RouterModule, HeroComponent, AllPostsComponent, HowItWorksComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  handleSearch({ query, category, location }: { query: string, category: string, location: string }) {
    console.log('Search Triggered:', query, category, location);
  }
}
