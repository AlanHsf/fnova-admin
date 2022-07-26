import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrpmComponent } from './frpm.component';

describe('FrpmComponent', () => {
  let component: FrpmComponent;
  let fixture: ComponentFixture<FrpmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrpmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
