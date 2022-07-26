import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCenterComponent } from './student-center.component';

describe('StudyComponent', () => {
  let component: StudentCenterComponent;
  let fixture: ComponentFixture<StudentCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
