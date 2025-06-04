import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dkdbcibqa/image/upload';
  private readonly UPLOAD_PRESET = 'lost-and-found';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<CloudinaryResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);
    formData.append('folder', 'samples/items');

    return this.http.post<CloudinaryResponse>(this.CLOUDINARY_URL, formData);
  }

  // Helper method to validate image file
  isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  // Helper method to get file size in readable format
  getReadableFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}