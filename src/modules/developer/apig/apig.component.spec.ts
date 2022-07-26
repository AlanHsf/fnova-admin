import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApigComponent } from './apig.component';

describe('ApigComponent', () => {
  let component: ApigComponent;
  let fixture: ComponentFixture<ApigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
