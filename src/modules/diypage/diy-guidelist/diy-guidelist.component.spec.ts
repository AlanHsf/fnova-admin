/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyGuidelistComponent } from './diy-guidelist.component';

describe('DiyGuidelistComponent', () => {
  let component: DiyGuidelistComponent;
  let fixture: ComponentFixture<DiyGuidelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyGuidelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyGuidelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
