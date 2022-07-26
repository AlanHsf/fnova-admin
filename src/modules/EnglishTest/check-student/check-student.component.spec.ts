import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStudentComponent } from './check-student.component';

describe('CheckStudentComponent', () => {
  let component: CheckStudentComponent;
  let fixture: ComponentFixture<CheckStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
