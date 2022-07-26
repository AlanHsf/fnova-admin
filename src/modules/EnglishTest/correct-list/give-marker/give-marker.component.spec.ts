import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveMarkerComponent } from './give-marker.component';

describe('GiveMarkerComponent', () => {
  let component: GiveMarkerComponent;
  let fixture: ComponentFixture<GiveMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveMarkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
