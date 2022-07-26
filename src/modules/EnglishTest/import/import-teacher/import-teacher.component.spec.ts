import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTeacherComponent } from './import-teacher.component';

describe('ImportTeacherComponent', () => {
  let component: ImportTeacherComponent;
  let fixture: ComponentFixture<ImportTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
