import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintClassComponent } from './print-class.component';

describe('PrintClassComponent', () => {
  let component: PrintClassComponent;
  let fixture: ComponentFixture<PrintClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
