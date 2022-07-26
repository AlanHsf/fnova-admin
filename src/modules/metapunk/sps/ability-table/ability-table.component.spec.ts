import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityTableComponent } from './ability-table.component';

describe('AbilityTableComponent', () => {
  let component: AbilityTableComponent;
  let fixture: ComponentFixture<AbilityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbilityTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
