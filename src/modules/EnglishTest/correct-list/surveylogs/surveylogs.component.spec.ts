import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyLogsComponent } from './surveylogs.component';

describe('SurveyLogsComponent', () => {
  let component: SurveyLogsComponent;
  let fixture: ComponentFixture<SurveyLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
