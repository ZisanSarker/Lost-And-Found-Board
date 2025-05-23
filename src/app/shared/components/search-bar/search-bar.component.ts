import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  query = '';
  category = 'all';
  location = 'all';
  showFilters = false;

  @Output() search = new EventEmitter<{ query: string; category: string; location: string }>();

  handleSearch() {
    this.search.emit({ query: this.query, category: this.category, location: this.location });
  }
}
