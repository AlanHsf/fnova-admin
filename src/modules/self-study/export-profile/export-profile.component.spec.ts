import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProfileComponent } from './export-profile.component';

describe('ExportProfileComponent', () => {
  let component: ExportProfileComponent;
  let fixture: ComponentFixture<ExportProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
