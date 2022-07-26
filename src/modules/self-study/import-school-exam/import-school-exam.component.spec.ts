import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSchoolExamComponent } from './import-school-exam.component';

describe('ImportSchoolExamComponent', () => {
  let component: ImportSchoolExamComponent;
  let fixture: ComponentFixture<ImportSchoolExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSchoolExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSchoolExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
