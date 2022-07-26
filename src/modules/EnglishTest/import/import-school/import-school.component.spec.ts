import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSchoolComponent } from './import-school.component';

describe('ImportSchoolComponent', () => {
  let component: ImportSchoolComponent;
  let fixture: ComponentFixture<ImportSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
