import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovIndexComponent } from './gov-index.component';

describe('VehicleIndexComponent', () => {
  let component: GovIndexComponent;
  let fixture: ComponentFixture<GovIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
