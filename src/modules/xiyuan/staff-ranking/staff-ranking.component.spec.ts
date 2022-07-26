import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffRankingComponent } from './staff-ranking.component';

describe('StaffRankingComponent', () => {
  let component: StaffRankingComponent;
  let fixture: ComponentFixture<StaffRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
