import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStaffRatioComponent } from './edit-staff-ratio.component';

describe('EditStaffRatioComponent', () => {
  let component: EditStaffRatioComponent;
  let fixture: ComponentFixture<EditStaffRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStaffRatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStaffRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
