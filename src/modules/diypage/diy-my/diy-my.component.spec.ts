/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyMyComponent } from './diy-my.component';

describe('DiyMyComponent', () => {
  let component: DiyMyComponent;
  let fixture: ComponentFixture<DiyMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyMyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
