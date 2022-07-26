import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationRecordComponent } from './vaccination-record.component';

describe('VaccinationRecordComponent', () => {
  let component: VaccinationRecordComponent;
  let fixture: ComponentFixture<VaccinationRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
