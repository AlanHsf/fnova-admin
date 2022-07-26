import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperDownloadComponent } from './paper-download.component';

describe('PaperDownloadComponent', () => {
  let component: PaperDownloadComponent;
  let fixture: ComponentFixture<PaperDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
