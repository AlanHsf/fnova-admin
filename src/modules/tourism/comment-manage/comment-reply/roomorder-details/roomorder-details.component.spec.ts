import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomorderDetailsComponent } from './roomorder-details.component';

describe('RoomorderDetailsComponent', () => {
  let component: RoomorderDetailsComponent;
  let fixture: ComponentFixture<RoomorderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomorderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomorderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
