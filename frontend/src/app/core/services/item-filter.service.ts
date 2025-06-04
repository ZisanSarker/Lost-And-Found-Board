import { Injectable } from '@angular/core';
import { Item } from '../../shared/models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemFilterService {
  filterItems(
    items: Item[],
    searchQuery: string,
    searchCategory: string,
    searchLocation: string
  ): Item[] {
    return items.filter((item) => {
      const matchesQuery = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = searchCategory === 'all' ||
        item.category === searchCategory;

      const matchesLocation = searchLocation === 'all' ||
        item.location.toLowerCase().includes(searchLocation.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }

  getEmptyMessage(activeTab: string, hasFilters: boolean): string {
    return hasFilters
      ? `No ${activeTab} items found matching your search criteria`
      : `No ${activeTab} items found`;
  }
}