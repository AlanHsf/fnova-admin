/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyHotdotbarComponent } from './diy-hotdotbar.component';

describe('DiyHotdotbarComponent', () => {
  let component: DiyHotdotbarComponent;
  let fixture: ComponentFixture<DiyHotdotbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyHotdotbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyHotdotbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
