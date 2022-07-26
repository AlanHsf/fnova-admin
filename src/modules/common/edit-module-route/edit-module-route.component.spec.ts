import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModuleRouteComponent } from './edit-module-route.component';

describe('EditModuleRouteComponent', () => {
  let component: EditModuleRouteComponent;
  let fixture: ComponentFixture<EditModuleRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModuleRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
