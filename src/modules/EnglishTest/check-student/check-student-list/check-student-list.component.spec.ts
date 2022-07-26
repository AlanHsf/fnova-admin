import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStudentListComponent } from './check-student-list.component';

describe('CheckStudentListComponent', () => {
  let component: CheckStudentListComponent;
  let fixture: ComponentFixture<CheckStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckStudentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
