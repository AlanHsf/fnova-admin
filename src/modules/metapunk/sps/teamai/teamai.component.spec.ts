import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamaiComponent } from './teamai.component';

describe('TeamaiComponent', () => {
  let component: TeamaiComponent;
  let fixture: ComponentFixture<TeamaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
