import { Listing, ListingFilter } from '../models/listing.model';

export class ListingUtils {
  static filterListings(listings: Listing[], filter: ListingFilter, searchQuery: string = ''): Listing[] {
    let filtered = [...listings];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.category.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter((listing) => listing.type === filter);
    }

    return filtered;
  }

  static sortListingsByDate(listings: Listing[], ascending: boolean = false): Listing[] {
    return [...listings].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  static getListingTypeLabel(type: 'lost' | 'found'): string {
    return type === 'lost' ? 'Lost' : 'Found';
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}