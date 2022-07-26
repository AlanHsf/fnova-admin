import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestFieldsComponent } from './edit-test-fields.component';

describe('EditTestFieldsComponent', () => {
  let component: EditTestFieldsComponent;
  let fixture: ComponentFixture<EditTestFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTestFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTestFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
