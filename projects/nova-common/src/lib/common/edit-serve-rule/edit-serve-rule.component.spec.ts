import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServeRuleComponent } from './edit-serve-rule.component';

describe('EditServeRuleComponent', () => {
  let component: EditServeRuleComponent;
  let fixture: ComponentFixture<EditServeRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditServeRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServeRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
