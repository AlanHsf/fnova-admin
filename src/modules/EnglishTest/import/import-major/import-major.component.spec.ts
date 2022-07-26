import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMajorComponent } from './import-major.component';

describe('ImportMajorComponent', () => {
  let component: ImportMajorComponent;
  let fixture: ComponentFixture<ImportMajorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportMajorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
