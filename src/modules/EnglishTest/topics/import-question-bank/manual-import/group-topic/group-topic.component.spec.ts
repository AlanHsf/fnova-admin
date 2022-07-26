import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTopicComponent } from './group-topic.component';

describe('GroupTopicComponent', () => {
  let component: GroupTopicComponent;
  let fixture: ComponentFixture<GroupTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
