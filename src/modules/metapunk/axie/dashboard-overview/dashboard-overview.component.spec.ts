import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SPSDashboardOverviewComponent } from './dashboard-overview.component';

describe('SPSDashboardOverviewComponent', () => {
  let component: SPSDashboardOverviewComponent;
  let fixture: ComponentFixture<SPSDashboardOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SPSDashboardOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SPSDashboardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
