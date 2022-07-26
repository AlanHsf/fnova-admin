import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSurveyOptionsComponent } from './edit-survey-options.component';

describe('EditSurveyOptionsComponent', () => {
  let component: EditSurveyOptionsComponent;
  let fixture: ComponentFixture<EditSurveyOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSurveyOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSurveyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
