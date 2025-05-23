import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { SearchBarComponent } from "../../shared/components/search-bar/search-bar.component";

@Component({
  selector: 'app-home',
  imports: [RouterModule, HeroComponent, SearchBarComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  handleSearch({ query, category, location }: { query: string, category: string, location: string }) {
    console.log('Search Triggered:', query, category, location);
  }
}
