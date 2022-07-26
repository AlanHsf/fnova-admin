import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyAccountComponent } from './diy-account.component';

describe('DiyAccountComponent', () => {
  let component: DiyAccountComponent;
  let fixture: ComponentFixture<DiyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiyAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
