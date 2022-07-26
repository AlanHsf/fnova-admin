import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncomeRatioComponent } from './edit-income-ratio.component';

describe('EditIncomeRatioComponent', () => {
  let component: EditIncomeRatioComponent;
  let fixture: ComponentFixture<EditIncomeRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIncomeRatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncomeRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
