import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGraduationComponent } from './import-graduation.component';

describe('ImportGraduationComponent', () => {
  let component: ImportGraduationComponent;
  let fixture: ComponentFixture<ImportGraduationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportGraduationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportGraduationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
