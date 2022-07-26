import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SPSDashboardMobileComponent } from './dashboard-mobile.component';

describe('SPSDashboardMobileComponent', () => {
  let component: SPSDashboardMobileComponent;
  let fixture: ComponentFixture<SPSDashboardMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SPSDashboardMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SPSDashboardMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
