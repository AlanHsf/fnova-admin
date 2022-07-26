import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCategoryComponent } from './import-category.component';

describe('ImportCategoryComponent', () => {
  let component: ImportCategoryComponent;
  let fixture: ComponentFixture<ImportCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
