import { Injectable } from '@angular/core';
import { ItemType } from '../../features/report/models/item.model';

@Injectable({
  providedIn: 'root'
})
export class UiTextService {
  getPageTitle(type: ItemType): string {
    return type === 'lost' ? 'Report a Lost Item' : 'Report a Found Item';
  }

  getPageDescription(type: ItemType): string {
    return type === 'lost'
      ? 'Fill out the form below with detailed information about your lost item. The more details you provide, the better chance of recovery.'
      : 'Fill out the form below with detailed information about the item you found. Help reunite it with its owner.';
  }

  getFormTitle(type: ItemType): string {
    return type === 'lost' ? 'Lost Item Details' : 'Found Item Details';
  }

  getFormDescription(type: ItemType): string {
    return type === 'lost'
      ? 'Please provide detailed information about your lost item to help others identify it.'
      : 'Please provide detailed information about the item you found to help identify the owner.';
  }

  getLocationLabel(type: ItemType): string {
    return type === 'lost' ? 'Last Seen Location' : 'Found Location';
  }

  getLocationPlaceholder(type: ItemType): string {
    return type === 'lost'
      ? 'Where did you last see it?'
      : 'Where did you find it?';
  }

  getDateLabel(type: ItemType): string {
    return type === 'lost' ? 'Date Lost' : 'Date Found';
  }

  getSubmitButtonText(type: ItemType): string {
    return type === 'lost' ? 'Report Lost Item' : 'Report Found Item';
  }
}