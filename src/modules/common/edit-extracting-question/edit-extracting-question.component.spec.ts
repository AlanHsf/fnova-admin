import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExtractingQuestionComponent } from './edit-extracting-question.component';

describe('EditExtractingQuestionComponent', () => {
  let component: EditExtractingQuestionComponent;
  let fixture: ComponentFixture<EditExtractingQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExtractingQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExtractingQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
