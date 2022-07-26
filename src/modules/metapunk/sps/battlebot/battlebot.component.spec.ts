import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlebotComponent } from './battlebot.component';

describe('BattlebotComponent', () => {
  let component: BattlebotComponent;
  let fixture: ComponentFixture<BattlebotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattlebotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlebotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
