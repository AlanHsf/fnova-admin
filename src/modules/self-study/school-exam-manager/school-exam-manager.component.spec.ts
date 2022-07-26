import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolExamManagerComponent } from './school-exam-manager.component';

describe('SchoolExamManagerComponent', () => {
  let component: SchoolExamManagerComponent;
  let fixture: ComponentFixture<SchoolExamManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolExamManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolExamManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
