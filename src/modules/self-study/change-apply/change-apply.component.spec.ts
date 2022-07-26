import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeApplyComponent } from './change-apply.component';

describe('ChangeApplyComponent', () => {
  let component: ChangeApplyComponent;
  let fixture: ComponentFixture<ChangeApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
