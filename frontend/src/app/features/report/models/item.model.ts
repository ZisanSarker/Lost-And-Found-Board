export interface ItemFormData {
  type: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contactInfo: string;
  userId: string;
  imageUrl?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

export type ItemType = 'lost' | 'found';

export interface ImageFile {
  file: File;
  preview: string;
}