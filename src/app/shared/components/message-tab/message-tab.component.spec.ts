import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTabComponent } from './message-tab.component';

describe('MessageTabComponent', () => {
  let component: MessageTabComponent;
  let fixture: ComponentFixture<MessageTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
