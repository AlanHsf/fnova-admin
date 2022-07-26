import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDistributedComponent } from './vehicle-distributed.component';

describe('VehicleDistributedComponent', () => {
  let component: VehicleDistributedComponent;
  let fixture: ComponentFixture<VehicleDistributedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDistributedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDistributedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
