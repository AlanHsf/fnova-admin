import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUpgradeRuleComponent } from './edit-upgrade-rule.component';

describe('EditUpgradeRuleComponent', () => {
  let component: EditUpgradeRuleComponent;
  let fixture: ComponentFixture<EditUpgradeRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUpgradeRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUpgradeRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
