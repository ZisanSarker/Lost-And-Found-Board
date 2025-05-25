import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DataService, Message } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="activeTab === 'messages'" class="p-4 bg-blue-50 rounded-lg">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Messages</h3>
        <p class="text-sm text-gray-600">Manage and reply to your messages</p>
      </div>

      <div *ngIf="messages.length === 0" class="text-gray-500 italic">
        No messages yet
      </div>

      <div *ngFor="let message of messages" class="bg-white mb-3 p-4 rounded-md shadow-sm flex justify-between items-start">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            {{ message.initial }}
          </div>
          <div>
            <strong class="block text-gray-800">{{ message.from }}</strong>
            <p class="text-sm text-gray-700">{{ message.message }}</p>
            <small class="text-xs text-gray-500">{{ message.time }}</small>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
          <button 
            type="button" 
            class="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
            View Item
          </button>

          <button 
            *ngIf="message.unread" 
            type="button" 
            (click)="markMessageAsRead(message.id)" 
            class="text-sm px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  `
})
export class MessageTabComponent implements OnInit, OnDestroy {
  @Input() activeTab!: string;
  @Input() messages: Message[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadMessages();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadMessages() {
    const messageSub = this.dataService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
    this.subscription.add(messageSub);
  }

  markMessageAsRead(id: number) {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.unread = false;
    }
  }
}
