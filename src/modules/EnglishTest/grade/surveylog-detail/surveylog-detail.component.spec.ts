import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveylogDetailComponent } from './surveylog-detail.component';

describe('SurveylogDetailComponent', () => {
  let component: SurveylogDetailComponent;
  let fixture: ComponentFixture<SurveylogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveylogDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveylogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
