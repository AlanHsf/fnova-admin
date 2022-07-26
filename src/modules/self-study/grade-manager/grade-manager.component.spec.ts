import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeManagerComponent } from './grade-manager.component';

describe('GradeManagerComponent', () => {
  let component: GradeManagerComponent;
  let fixture: ComponentFixture<GradeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
