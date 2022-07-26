import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAnalyComponent } from './grade-analy.component';

describe('GradeAnalyComponent', () => {
  let component: GradeAnalyComponent;
  let fixture: ComponentFixture<GradeAnalyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeAnalyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeAnalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
