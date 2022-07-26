import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSchoolMajorComponent } from './import-school-major.component';

describe('ImportSchoolMajorComponent', () => {
  let component: ImportSchoolMajorComponent;
  let fixture: ComponentFixture<ImportSchoolMajorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSchoolMajorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSchoolMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
