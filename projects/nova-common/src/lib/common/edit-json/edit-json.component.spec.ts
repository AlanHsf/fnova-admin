/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditJsonComponent } from './edit-json.component';

describe('EditJsonComponent', () => {
  let component: EditJsonComponent;
  let fixture: ComponentFixture<EditJsonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJsonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
