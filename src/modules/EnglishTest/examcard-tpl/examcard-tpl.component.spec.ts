import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamcardTplComponent } from './examcard-tpl.component';

describe('ExamcardTplComponent', () => {
  let component: ExamcardTplComponent;
  let fixture: ComponentFixture<ExamcardTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamcardTplComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamcardTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
