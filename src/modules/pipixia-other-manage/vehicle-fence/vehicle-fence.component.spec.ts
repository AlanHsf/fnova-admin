import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFenceComponent } from './vehicle-fence.component';

describe('VehicleFenceComponent', () => {
  let component: VehicleFenceComponent;
  let fixture: ComponentFixture<VehicleFenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleFenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleFenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
