import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTopicComponent } from './text-topic.component';

describe('TextTopicComponent', () => {
  let component: TextTopicComponent;
  let fixture: ComponentFixture<TextTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
