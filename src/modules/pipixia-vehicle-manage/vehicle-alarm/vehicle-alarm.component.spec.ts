import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAlarmComponent } from './vehicle-alarm.component';

describe('VehicleAlarmComponent', () => {
  let component: VehicleAlarmComponent;
  let fixture: ComponentFixture<VehicleAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
