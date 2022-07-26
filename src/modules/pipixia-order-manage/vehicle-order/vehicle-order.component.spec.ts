import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOrderComponent } from './vehicle-order.component';

describe('VehicleOrderComponent', () => {
  let component: VehicleOrderComponent;
  let fixture: ComponentFixture<VehicleOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
