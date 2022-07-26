import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameShopComponent } from './frame-shop.component';

describe('FrameShopComponent', () => {
  let component: FrameShopComponent;
  let fixture: ComponentFixture<FrameShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
