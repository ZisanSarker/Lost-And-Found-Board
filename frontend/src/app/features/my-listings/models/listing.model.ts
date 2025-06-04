export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  contactInfo: string;
  userId: string;
  imageUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingResponse {
  success: boolean;
  data: Listing[];
  count: number;
  message?: string;
}

export interface ListingActionResponse {
  success: boolean;
  message: string;
  data?: Listing;
}

export type ListingFilter = 'all' | 'lost' | 'found';

export interface FilterTab {
  label: string;
  value: ListingFilter;
}