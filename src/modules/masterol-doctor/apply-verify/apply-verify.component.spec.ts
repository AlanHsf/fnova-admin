import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyVerifyComponent } from './apply-verify.component';

describe('ApplyVerifyComponent', () => {
  let component: ApplyVerifyComponent;
  let fixture: ComponentFixture<ApplyVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
