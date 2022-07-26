import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard2019Component } from './dashboard-2019.component';

describe('Dashboard2019Component', () => {
  let component: Dashboard2019Component;
  let fixture: ComponentFixture<Dashboard2019Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dashboard2019Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dashboard2019Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
