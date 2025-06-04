export type ItemType = 'lost' | 'found';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: ItemType;
  contactInfo: string;
  userId: string;
  image?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: ItemType;
  contactInfo: string;
  image?: File;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  count?: number;
  message: string;
}