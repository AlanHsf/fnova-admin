/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyShopComponent } from './diy-shop.component';

describe('DiyShopComponent', () => {
  let component: DiyShopComponent;
  let fixture: ComponentFixture<DiyShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
