import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayRecordComponent } from './pay-record.component';

describe('PayRecordComponent', () => {
  let component: PayRecordComponent;
  let fixture: ComponentFixture<PayRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
