import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStudyComponent } from './student-study.component';

describe('StudentStudyComponent', () => {
  let component: StudentStudyComponent;
  let fixture: ComponentFixture<StudentStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
