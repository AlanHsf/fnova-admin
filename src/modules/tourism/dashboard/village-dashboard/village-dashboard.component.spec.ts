import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageDashboardComponent } from './village-dashboard.component';

describe('VillageDashboardComponent', () => {
  let component: VillageDashboardComponent;
  let fixture: ComponentFixture<VillageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VillageDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VillageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
