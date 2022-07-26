import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStudentidComponent } from './import-studentid.component';

describe('ImportStudentidComponent', () => {
  let component: ImportStudentidComponent;
  let fixture: ComponentFixture<ImportStudentidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportStudentidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportStudentidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
