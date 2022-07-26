import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionComplaintComponent } from './construction-complaint.component';

describe('ConstructionComplaintComponent', () => {
  let component: ConstructionComplaintComponent;
  let fixture: ComponentFixture<ConstructionComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructionComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
