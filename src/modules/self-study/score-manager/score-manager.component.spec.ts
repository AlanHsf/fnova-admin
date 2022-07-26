import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreManagerComponent } from './score-manager.component';

describe('ScoreManagerComponent', () => {
  let component: ScoreManagerComponent;
  let fixture: ComponentFixture<ScoreManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
