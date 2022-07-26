import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTrackComponent } from './vehicle-track.component';

describe('VehicleTrackComponent', () => {
  let component: VehicleTrackComponent;
  let fixture: ComponentFixture<VehicleTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
