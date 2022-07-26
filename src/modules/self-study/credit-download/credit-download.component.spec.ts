import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDownloadComponent } from './credit-download.component';

describe('CreditDownloadComponent', () => {
  let component: CreditDownloadComponent;
  let fixture: ComponentFixture<CreditDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
