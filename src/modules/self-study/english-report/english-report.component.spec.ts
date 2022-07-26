import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishReportComponent } from './english-report.component';

describe('EnglishReportComponent', () => {
  let component: EnglishReportComponent;
  let fixture: ComponentFixture<EnglishReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
