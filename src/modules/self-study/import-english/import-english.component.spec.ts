import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEnglishComponent } from './import-english.component';

describe('ImportEnglishComponent', () => {
  let component: ImportEnglishComponent;
  let fixture: ComponentFixture<ImportEnglishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportEnglishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
