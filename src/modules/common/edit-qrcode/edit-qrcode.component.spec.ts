import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQRCodeComponent } from './edit-qrcode.component';

describe('EditQRCodeComponent', () => {
  let component: EditQRCodeComponent;
  let fixture: ComponentFixture<EditQRCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQRCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQRCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
