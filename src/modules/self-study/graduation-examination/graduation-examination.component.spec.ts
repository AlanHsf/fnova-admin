import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduationExaminationComponent } from './graduation-examination.component';

describe('GraduationExaminationComponent', () => {
  let component: GraduationExaminationComponent;
  let fixture: ComponentFixture<GraduationExaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduationExaminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduationExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
