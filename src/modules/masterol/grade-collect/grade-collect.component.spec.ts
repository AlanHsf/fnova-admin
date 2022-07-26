import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeCollectComponent } from './grade-collect.component';

describe('GradeCollectComponent', () => {
  let component: GradeCollectComponent;
  let fixture: ComponentFixture<GradeCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeCollectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
