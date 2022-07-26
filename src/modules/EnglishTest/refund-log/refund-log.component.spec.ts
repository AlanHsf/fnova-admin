import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundLogComponent } from './refund-log.component';



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


describe('RefundLogComponent', () => {
  let component: RefundLogComponent;
  let fixture: ComponentFixture<RefundLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
