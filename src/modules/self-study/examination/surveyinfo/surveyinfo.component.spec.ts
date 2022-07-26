import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyinfoComponent } from './surveyinfo.component';

describe('SurveyinfoComponent', () => {
  let component: SurveyinfoComponent;
  let fixture: ComponentFixture<SurveyinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
