import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDepartAreaComponent } from './import-depart-area.component';

describe('ImportDepartAreaComponent', () => {
  let component: ImportDepartAreaComponent;
  let fixture: ComponentFixture<ImportDepartAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDepartAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDepartAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
