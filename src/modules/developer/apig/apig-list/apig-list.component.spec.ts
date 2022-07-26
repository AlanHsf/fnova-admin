/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApigListComponent } from './apig-list.component';

describe('ApigListComponent', () => {
  let component: ApigListComponent;
  let fixture: ComponentFixture<ApigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
