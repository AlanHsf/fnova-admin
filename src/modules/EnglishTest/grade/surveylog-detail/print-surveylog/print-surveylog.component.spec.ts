import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSurveylogComponent } from './print-surveylog.component';

describe('PrintSurveylogComponent', () => {
  let component: PrintSurveylogComponent;
  let fixture: ComponentFixture<PrintSurveylogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSurveylogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSurveylogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
