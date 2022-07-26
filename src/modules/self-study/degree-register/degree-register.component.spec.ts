import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeRegisterComponent } from './degree-register.component';

describe('DegreeRegisterComponent', () => {
  let component: DegreeRegisterComponent;
  let fixture: ComponentFixture<DegreeRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegreeRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
