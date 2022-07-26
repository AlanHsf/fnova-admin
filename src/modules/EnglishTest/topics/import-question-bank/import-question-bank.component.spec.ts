import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQuestionBankComponent } from './import-question-bank.component';

describe('ImportQuestionBankComponent', () => {
  let component: ImportQuestionBankComponent;
  let fixture: ComponentFixture<ImportQuestionBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportQuestionBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
