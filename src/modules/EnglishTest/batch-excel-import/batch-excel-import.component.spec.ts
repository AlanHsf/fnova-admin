import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchExcelImportComponent } from './batch-excel-import.component';

describe('BatchExcelImportComponent', () => {
  let component: BatchExcelImportComponent;
  let fixture: ComponentFixture<BatchExcelImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchExcelImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchExcelImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
