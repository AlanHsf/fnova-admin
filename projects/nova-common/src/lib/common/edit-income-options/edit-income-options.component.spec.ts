import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncomeOptionsComponent } from './edit-income-options.component';

describe('EditIncomeOptionsComponent', () => {
  let component: EditIncomeOptionsComponent;
  let fixture: ComponentFixture<EditIncomeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIncomeOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncomeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
