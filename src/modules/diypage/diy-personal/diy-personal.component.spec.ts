import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyPersonalComponent } from './diy-personal.component';

describe('DiyPersonalComponent', () => {
  let component: DiyPersonalComponent;
  let fixture: ComponentFixture<DiyPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiyPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
