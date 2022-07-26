import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradePasscertComponent } from './grade-passcert.component';

describe('GradePasscertComponent', () => {
  let component: GradePasscertComponent;
  let fixture: ComponentFixture<GradePasscertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradePasscertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradePasscertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
