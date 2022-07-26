import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportScoreComponent } from './import-score.component';

describe('ImportScoreComponent', () => {
  let component: ImportScoreComponent;
  let fixture: ComponentFixture<ImportScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
