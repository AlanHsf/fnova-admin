import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInResultComponent } from './check-in-result.component';

describe('CheckInResultComponent', () => {
  let component: CheckInResultComponent;
  let fixture: ComponentFixture<CheckInResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
