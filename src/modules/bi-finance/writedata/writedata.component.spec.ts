/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WritedataComponent } from './writedata.component';

describe('WritedataComponent', () => {
  let component: WritedataComponent;
  let fixture: ComponentFixture<WritedataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritedataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
