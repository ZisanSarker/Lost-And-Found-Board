import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../../../core/services/cloudinary.service';
import { ToastrService } from 'ngx-toastr';
import { ImageFile } from '../../models/item.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
      <!-- Upload Area -->
      <div *ngIf="!selectedImage && !uploadedImageUrl" class="space-y-3">
        <ng-container *ngTemplateOutlet="uploadTemplate"></ng-container>
      </div>

      <!-- Selected Image Preview -->
      <div *ngIf="selectedImage && !isUploading && !uploadedImageUrl" class="space-y-3">
        <ng-container *ngTemplateOutlet="previewTemplate"></ng-container>
      </div>

      <!-- Uploading State -->
      <div *ngIf="isUploading" class="space-y-3">
        <ng-container *ngTemplateOutlet="loadingTemplate"></ng-container>
      </div>

      <!-- Uploaded Image -->
      <div *ngIf="uploadedImageUrl" class="space-y-3">
        <ng-container *ngTemplateOutlet="successTemplate"></ng-container>
      </div>
    </div>

    <!-- Upload Template -->
    <ng-template #uploadTemplate>
      <svg class="mx-auto h-12 w-12 text-orange-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
        <path 
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </svg>
      <div>
        <input
          type="file"
          accept="image/*"
          (change)="onImageSelected($event)"
          class="hidden"
          #fileInput
        />
        <button
          type="button"
          (click)="fileInput.click()"
          class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Choose Image
        </button>
        <p class="text-sm text-orange-600 mt-2">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>
    </ng-template>

    <!-- Preview Template -->
    <ng-template #previewTemplate>
      <img 
        [src]="selectedImage?.preview" 
        alt="Preview" 
        class="mx-auto h-32 w-32 object-cover rounded-lg"
      >
      <p class="text-sm text-orange-700">{{ selectedImage?.file?.name }}</p>
      <p class="text-xs text-orange-600">{{ getFileSize(selectedImage?.file?.size || 0) }}</p>
      <div class="flex justify-center space-x-2">
        <button
          type="button"
          (click)="imageRemoved.emit()"
          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded transition-colors"
        >
          Remove
        </button>
        <button
          type="button"
          (click)="fileInput.click()"
          class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 text-sm rounded transition-colors"
        >
          Change
        </button>
        <input
          type="file"
          accept="image/*"
          (change)="onImageSelected($event)"
          class="hidden"
          #fileInput
        />
      </div>
    </ng-template>

    <!-- Loading Template -->
    <ng-template #loadingTemplate>
      <svg 
        class="animate-spin mx-auto h-8 w-8 text-orange-600" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          class="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          stroke-width="4"
        ></circle>
        <path 
          class="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="text-orange-600">Uploading image...</p>
    </ng-template>

    <!-- Success Template -->
    <ng-template #successTemplate>
      <img 
        [src]="uploadedImageUrl" 
        alt="Uploaded" 
        class="mx-auto h-32 w-32 object-cover rounded-lg"
      >
      <p class="text-sm text-green-600 font-medium">✓ Image uploaded successfully</p>
      <button
        type="button"
        (click)="uploadedImageRemoved.emit()"
        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded transition-colors"
      >
        Remove Image
      </button>
    </ng-template>
  `
})
export class ImageUploadComponent {
  @Input() selectedImage: ImageFile | null = null;
  @Input() uploadedImageUrl: string = '';
  @Input() isUploading: boolean = false;
  
  @Output() imageSelected = new EventEmitter<ImageFile>();
  @Output() imageRemoved = new EventEmitter<void>();
  @Output() uploadedImageRemoved = new EventEmitter<void>();

  constructor(
    private cloudinaryService: CloudinaryService,
    private toastr: ToastrService
  ) {}

  async onImageSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.cloudinaryService.isValidImageFile(file)) {
      this.toastr.error('Please select a valid image file (JPEG, PNG, GIF) under 5MB', 'Invalid File');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageFile: ImageFile = {
        file: file,
        preview: e.target.result
      };
      this.imageSelected.emit(imageFile);
    };
    reader.readAsDataURL(file);
  }

  getFileSize(bytes: number): string {
    return this.cloudinaryService.getReadableFileSize(bytes);
  }
}