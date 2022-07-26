import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperReportComponent } from './paper-report.component';

describe('PaperReportComponent', () => {
  let component: PaperReportComponent;
  let fixture: ComponentFixture<PaperReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
