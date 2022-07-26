/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HyperspaceComponent } from './hyperspace.component';

describe('HyperspaceComponent', () => {
  let component: HyperspaceComponent;
  let fixture: ComponentFixture<HyperspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
