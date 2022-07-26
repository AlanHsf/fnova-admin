/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiySingleimgComponent } from './diy-singleimg.component';

describe('DiySingleimgComponent', () => {
  let component: DiySingleimgComponent;
  let fixture: ComponentFixture<DiySingleimgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiySingleimgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiySingleimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
