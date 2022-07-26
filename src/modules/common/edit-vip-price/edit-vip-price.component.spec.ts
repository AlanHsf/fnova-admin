/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditVipPriceComponent } from './edit-vip-price.component';

describe('EditVipPriceComponent', () => {
  let component: EditVipPriceComponent;
  let fixture: ComponentFixture<EditVipPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVipPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVipPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
