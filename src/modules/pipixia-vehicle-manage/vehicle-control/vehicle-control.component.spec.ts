import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleControlComponent } from './vehicle-control.component';

describe('VehicleControlComponent', () => {
  let component: VehicleControlComponent;
  let fixture: ComponentFixture<VehicleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
