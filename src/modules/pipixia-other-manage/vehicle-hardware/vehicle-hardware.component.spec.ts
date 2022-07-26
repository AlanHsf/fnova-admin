import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleHardwareComponent } from './vehicle-hardware.component';

describe('VehicleHardwareComponent', () => {
  let component: VehicleHardwareComponent;
  let fixture: ComponentFixture<VehicleHardwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleHardwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleHardwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
