import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionManageComponent } from './question-manage.component';

describe('QuestionManageComponent', () => {
  let component: QuestionManageComponent;
  let fixture: ComponentFixture<QuestionManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
