import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEnglishScoreComponent } from './import-english-score.component';

describe('ImportEnglishScoreComponent', () => {
  let component: ImportEnglishScoreComponent;
  let fixture: ComponentFixture<ImportEnglishScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportEnglishScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEnglishScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
