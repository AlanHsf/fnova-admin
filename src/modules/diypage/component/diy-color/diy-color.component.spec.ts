/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyColorComponent } from './diy-color.component';

describe('DiyColorComponent', () => {
  let component: DiyColorComponent;
  let fixture: ComponentFixture<DiyColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
