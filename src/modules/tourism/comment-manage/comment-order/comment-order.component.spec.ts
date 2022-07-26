import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentorderComponent } from './comment-order.component';

describe('CommentReplyComponent', () => {
  let component: CommentorderComponent;
  let fixture: ComponentFixture<CommentorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
