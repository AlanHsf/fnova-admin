import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleIndexComponent } from './vehicle-index.component';

describe('VehicleIndexComponent', () => {
  let component: VehicleIndexComponent;
  let fixture: ComponentFixture<VehicleIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
