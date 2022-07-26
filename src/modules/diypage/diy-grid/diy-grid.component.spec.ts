/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyGridComponent } from './diy-grid.component';

describe('DiyGridComponent', () => {
  let component: DiyGridComponent;
  let fixture: ComponentFixture<DiyGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
