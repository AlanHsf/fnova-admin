import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKnowDescComponent } from './edit-know-desc.component';

describe('EditKnowDescComponent', () => {
  let component: EditKnowDescComponent;
  let fixture: ComponentFixture<EditKnowDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditKnowDescComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnowDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
