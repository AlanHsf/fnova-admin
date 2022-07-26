import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatCheckComponent } from './repeat-check.component';

describe('RepeatCheckComponent', () => {
  let component: RepeatCheckComponent;
  let fixture: ComponentFixture<RepeatCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
