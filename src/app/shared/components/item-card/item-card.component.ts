import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  image?: string;
}

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './item-card.component.html',
})
export class ItemCardComponent {
  @Input() item!: ItemCardProps;

  get statusColor() {
    return this.item.type === 'lost'
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800';
  }
}
