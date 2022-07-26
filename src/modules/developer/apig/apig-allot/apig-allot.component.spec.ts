import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApigAllotComponent } from './apig-allot.component';

describe('ApigAllotComponent', () => {
  let component: ApigAllotComponent;
  let fixture: ComponentFixture<ApigAllotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApigAllotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApigAllotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
