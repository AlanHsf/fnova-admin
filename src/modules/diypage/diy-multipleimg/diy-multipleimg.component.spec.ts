/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyMultipleimgComponent } from './diy-multipleimg.component';

describe('DiyMultipleimgComponent', () => {
  let component: DiyMultipleimgComponent;
  let fixture: ComponentFixture<DiyMultipleimgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyMultipleimgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyMultipleimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
