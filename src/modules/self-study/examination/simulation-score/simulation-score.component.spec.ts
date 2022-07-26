import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationScoreComponent } from './simulation-score.component';

describe('SimulationScoreComponent', () => {
  let component: SimulationScoreComponent;
  let fixture: ComponentFixture<SimulationScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
