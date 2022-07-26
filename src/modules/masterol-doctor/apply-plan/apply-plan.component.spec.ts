import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyPlanComponent } from './apply-plan.component';

describe('ApplyPlanComponent', () => {
  let component: ApplyPlanComponent;
  let fixture: ComponentFixture<ApplyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
