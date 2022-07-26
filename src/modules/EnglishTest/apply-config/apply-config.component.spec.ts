import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyConfigComponent } from './apply-config.component';

describe('ApplyConfigComponent', () => {
  let component: ApplyConfigComponent;
  let fixture: ComponentFixture<ApplyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
