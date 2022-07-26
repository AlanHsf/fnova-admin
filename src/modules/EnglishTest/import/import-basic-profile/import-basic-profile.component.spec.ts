import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBasicProfileComponent } from './import-basic-profile.component';

describe('ImportBasicProfileComponent', () => {
  let component: ImportBasicProfileComponent;
  let fixture: ComponentFixture<ImportBasicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBasicProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBasicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
