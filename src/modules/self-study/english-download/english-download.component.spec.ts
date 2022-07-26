import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishDownloadComponent } from './english-download.component';

describe('EnglishDownloadComponent', () => {
  let component: EnglishDownloadComponent;
  let fixture: ComponentFixture<EnglishDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
