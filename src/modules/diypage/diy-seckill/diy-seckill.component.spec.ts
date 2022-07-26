/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiySeckillComponent } from './diy-seckill.component';

describe('DiySeckillComponent', () => {
  let component: DiySeckillComponent;
  let fixture: ComponentFixture<DiySeckillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiySeckillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiySeckillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
