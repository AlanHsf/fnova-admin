import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPayComponent } from './student-pay.component';

describe('StudentPayComponent', () => {
  let component: StudentPayComponent;
  let fixture: ComponentFixture<StudentPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
